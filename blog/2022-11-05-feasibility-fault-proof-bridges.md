---
title: On the feasibility of a Fault-proof Based Blockchain Bridge
slug: feasibility-fault-proof-bridges
authors: willem
tags: [bridges, provable computation, fraud-proofs]
---

For the hackathon at EthBogota the ChainSafe team developed a new bridge prototype we called [Zipline](https://ethglobal.com/showcase/zipline-05w8k). This bridge uses fault proofs, the technology behind optimistic rollups, to construct a bridge. But is this actually a good idea? This article investigates some potential issues but also some paths forward to a practical version of such a bridge construction.

<!--truncate-->

## Overview

Our project, like all great hackathon entries, is a bit of a Frankenstein. Inspired by the work on ZK bridges by Succinct Labs[^1], it uses the fault proof code from Optimism Cannon[^2] and the Eth2 light client code from Snowbridge[^3] to build a trustless block header relay for Gasper based chains (e.g. Ethereum and Gnosis Chain) to EVM chains.

The logic is fairly straightforward. The Altair hard-fork adds a light-client protocol to the beacon chain that allows resource constrained devices to trustlessly follow along with minimal communication and computational effort. Even this lightweight protocol is too expensive to execute within an EVM runtime and so we use fault proofs to allow off-chain execution of the light client protocol with on-chain settlement.

In the final Zipline protocol anyone can submit sync updates along with a sizeable bond. These updates have a challenge period during which anyone can dispute their validity and trigger the dispute resolution game (by also submitting a bond). This game uses bisection of the execution trace to resolve the instruction where fraud may have taken place. The isolated instruction is executed by the chain as the final judgement for if there was fraud or not.

It works exactly like fault-proof based rollups (e.g. Optimism, Arbitrum) but instead of executing transactions it is validating the light-client protocol of another chain.

## On-chain Requirements

In Zipline each sync period requires the following data to update:

- Attested block header hash
- Aggregate BLS committee signature and participation bitfield
- Next period sync committee (512 public keys)
- Merkle proof of new committee

Given an accepted prior committee the state transition function combines a subset of the committee keys to produce an aggregate public key to verify the attested block header (this is the main computation). It also needs to verify that the proposed new committee is correct. Since this is stored in the state this can be checked by verifying a Merkle state proof. The combined update ends up being around 25KB. 

To make this data available to the provable execution we are using a technique from Cannon called the Pre-image Oracle. This allows the code running in a provable execution context to request any data by its hash. This seems slightly magical but the reason it works is that the provable execution can essentially freeze until this data has been provided to it. If the data (pre-image) cannot be provided then the challenge game cannot continue and fraud cannot be proven.

In our original design we went to great lengths to ensure that:

1. The sync update data is always available
2. The code cannot request a hash which has no available pre-image

We did this by requiring that the entire sync update message is submitted to the destination chain in calldata for each update. It is then hashed by the runtime and this hash inserted into the memory trie for the provable execution. Later on the provable execution code could use this hash to request the full data using the pre-image oracle.

The downside to this approach is gas costs. Mostly from calldata alone the cost to make each update is around 300k gas. Not impractically expensive but not cheap either. Especially considering the bridge must pay this every 27 hours for as long as it wants to run.

### Proposed Improvement

Later we had the insight that for a header relay it is acceptable to rely on the origin chain to provide the data availability. This still leaves the issue of block relayers who might submit garbage hashes for which there is no available pre-image and which therefore cannot be proven as fraud.

Our solution to this borrows an idea from state channels. It essentially adds a new kind of challenge, a pre-image challenge. A relayer submits only the hash of sync update data. If a watcher is unable to find the corresponding pre-image (and is therefore unable to check if the computation is valid) they can issue a pre-image challenge. The original relayer must then submit the pre-image on-chain within a given time period or have their bond slashed and issued to the challenger, the same penalty as fraud. The challenge should also be bonded to prevent griefing of the relayer.

Since the only valid sync updates are produced by another blockchain there are good guarantees that this data will be available. Submitting anything other than valid updates is fraud so a challenger can be certain of their own correctness before initiating a challenge.

In the happy case this reduces the calldata requirements down to a single hash making Zipline incredibly cheap to run.

## Light client Protocol - Is it suitable?

One strong assumption in the design is that the light-client protocol is suitable for these kinds of applications. At first glance it appears so but in reality it was made for quite a different purpose.

In the light-client protocol a subset of 512 validators known as the sync committee is selected to attest to the finalized block headers in their sync period (256 epochs). Every sync period this committee is rotated out and replaced with a new random committee. Committee members know one sync period in advance that they have been chosen.

The members of the sync committee are eligible for additional rewards for consistent signing of all the headers in their period. There are currently no penalties for sync committee misbehavior (equivocation or signing unfinalized blocks) other than missed rewards.

The strength of the light-client protocol is it does not require storing of the entire validator set (currently hundreds of thousands of addresses). The committee rotation can be verified with a few Merkle proofs and a previously validated block. It also significantly reduces the number of signatures that must be aggregated and validated to check block finality. This is perfect for mobile or browser devices that need to verify state or transactions in the chain.

### An attack on a light-client bridge

If 2/3 of a sync committee could collude it would be trivial for them to sign a fraudulent block header which by definition would be accepted by Zipline. According to the current light-client protocol they would not even be penalized for doing so. 

Coordinating such an attack could be quite simple. Firstly there is a long time (2 sync periods or 54 hours) during which the nodes could coordinate. One could imagine a contract on the bridge destination chain that guarantees any colluding member of the committee receives a share of the value extracted from the bridge. Once the exploitable value reaches a certain threshold collusion would be an inevitability.

Even if the sync committee could be slashed for misbehavior collusion could still be worth it if the bridge could be hacked for more than the total slashable (32 * 512 * 2/3 = ~11k Eth). With bridges consistently being hacked for value far exceeding this could be real threat for light-client based bridges.

## Switching to Full Consensus

With the improvements suggested in the previous section there is actually nothing preventing Zipline from following the full Gasper consensus protocol rather than the light client. This requires more complexity in the state and inputs - the off-chain state must keep track of the entire validator set and the validators that enter/exit each epoch. It would also require aggregating a much larger verification key (1/32 of the full validator set, about 3k keys at the time of writing) to verify the finality of each block.

That aside in the happy case the on-chain storage and execution cost remains the same. The main difference is that this would require receiving an update for every epoch rather than every sync period so the required rate of updates is 256 times faster. The protocol must receive one update per epoch in order to follow the chain.

There is no doubt that this is the way forward in creating a secure bridge protocol based on Zipline. Such a bridge would inherit the economic security properties of the beacon chain (1/3 of all stake must be slashed to revert a finalized block). 

## Fault Proof Delays

Assuming that the consensus protocol is secure, Zipline still has the same issue that other fault-proof based systems have - the challenge period delay.

Prior to an update being accepted it must have a period during which any honest actor can observe fraud and initiate the challenge game. The question of how long this period must be is an interesting one. It must be sufficiently long to allow for:

1. Off-chain actors to perform the computation for themselves to verify its correctness
2. A challenger to have a transaction included showing fraud has occurred

The first point is less impactful overall as the computation for Zipline can be done in just a few seconds. Far more important is the second point. When attacking targets with potentially large payoffs (e.g. a bridge) it may be economically worthwhile for the attacker to purchase all blockspace for the duration of the challenge period, effectively censoring any transactions that are trying to prove fraud. The challenge period should therefore be set such that the cost of performing such a censoring attack is greater than the potential gains.

It is difficult to design the period length since it depends on so many extraneous factors: the gas price, exploitable value in the bridge/rollup, chain congestion etc. This is why most fraud-proof based system adopt the arbitrary, but safe, period of 7 days. 

The question of if this is too long to wait for a bridge I think depends on the application. For traders chasing DeFi arbitrage opportunities it is almost certainly unacceptable, however, for being a gateway by which large volumes of wrapped ether are bridged to other chains it could be perfect.

Zipline also inherits the property other optimistic rollups have that allow for fast exits. Any off-chain observer can know if they system is committing fraud or not, even if the chain doesn't know yet. This makes it possible for liquidity providers to front funds to users of the bridge with the knowledge that they will inevitably receive their own wrapped tokens within 7 days with zero additional risk. A token bridge based on this protocol is likely the way forward for fraud-proof based bridges however it does not help with transferring non-fungible assets or generic message passing.

## For the Future

For Zipline to be safe and feasible it needs to make the switch to following the full consensus protocol rather than the light-client. This should come with minimal extra cost in the happy case as all of the computation and data remains off-chain. It does require much more frequent updates however (once per epoch rather than once per sync period). 

Given this and the fast-exit strategy it should be possible to develop a cheap and user friendly token bridge based off of the Zipline block header relay. NFT and arbitrary message passing applications would still have to wait a full challenge period.

It would also be worth investigating how it could work for consensus protocols other than Gasper. Other popular BFT finality algorithms such as Tendermint and GRANDPA would be excellent candidates.

[^1]: https://arxiv.org/abs/2210.00264
[^2]: https://github.com/ethereum-optimism/cannon
[^3]: https://github.com/Snowfork/snowbridge
