---
slug: dispute-games
title: On-Chain Dispute Games - Past, Present and Future
authors: [willem]
tags: [l2, interoperability, game-theory, p2p]
keywords: [dispute, blockchain, optimism, arbitrum, l2, optimistic, scaling]
draft: false
date: 2023-09-21
image: https://solutions.chainsafe.io/img/post-thumbnail.png
description: A short survey of different strategies of resolving disputes on-chain
hide_table_of_contents: false
---

One way to think of a blockchain is as a system for verifying provable statements to alter a global state. Examples of provable statements include:

- Proving you hold a private key corresponding to a public key by signing some data. This is how transactions are authorized to mutate the ledger.
- A proof-of-work (PoW)
- Proving you know the pre-image of a hash
- Proving result of executing a known, deterministic program on known data. The blockchain executes the program itself to check the result
- A SNARK proof of the result of executing a known program on (possibly unknown) data

To verify a proof, the blockchain performs the verification computation inside its execution and this can result in changes to global state. Other on-chain applications can treat the result as if it is truth.

Some statements have a lovely property in that they are *succinct*. This means it is easier to verify them than it is to prove them (PoW, SNARK). Others take the same amount of work either way (deterministic arbitrary computation). 

What you might have spotted from above is that some of these are in theory provable statements but they are impractical to prove on a blockchain. For example hashing an extremely large piece of data, or checking the result of a long and complex computation.

Dispute games are multi-party protocols that, under certain economic conditions, can allow a blockchain to be convinced of a statement while only having to execute a small part of a computation when disputes arise.


## One-step Fraud Proving

For statements that could be proven on-chain there is an elegant solution that can avoid expensive verification costs. In a one-step fraud proof Ashley submits a statement on-chain (e.g. the result of this computation is X) along with a bond. The bond should be greater than the expected gas cost of having the chain verify the proof.

The statement is considered pending by the chain for a length of time known as the challenge period. During this time anyone (Bellamy) can pay the gas and force the chain to perform the check in full. This will then determine if Ashley was indeed correct and update the state accordingly. If Ashley is proven to be wrong their bond is slashed and given to Bellamy.

Importantly, if no one challenges Ashley during the challenge period it is safe to assume the statement is true under the assumption that there is at least one observer who would have proven Ashely false if they could.

This approach is great for on-going protocols like rollups where it is important to keep the running cost low. It is relatively simple in its implementation and can be permissionless. 

This design was used by the early versions of Optimism such that the rollup state transition was only computed on L1 in the case of a dispute. Another clever application is in the [Eth-NEAR Rainbow Bridge][5] where one-step fraud proofs are used to avoid performing expensive Ed25519 signature checks on Ethereum under regular operation. In recent months some projects such as [Fuel][6] have proposed using on-step fraud proofs to avoid performing expensive SNARK verification unless there is a dispute.

The downside to one-step proofs is they are not applicable in every case. It must be possible to fall back to executing the verification on-chain. Some types of computation are simply too large or require too much data for this to be feasible. What can be done in this case?

## 2-party bisection dispute games

The [Arbitrum paper][1] first popularized bisection dispute games in the blockchain space. To understand a bisection game you first need to understand emulators and the computation trace. 

A program can be expressed as a sequence of instructions to be executed on a processor. This processor also has registers and/or memory to store state.

Executing the program and recording the registers+memory at after each instruction is called an execution trace. This trace may be much longer than the original program as instructions may branch or loop. For a program that terminates this execution trace can be considered a very verbose proof of the final state. A program that knows how to execute all the possible instructions and update the state accordingly (an emulator) can verify this proof.

A program trace for any non-trivial program is absurdly huge, but it can be compressed using two clever tricks.

The first is that the full CPU+memory state need not be included at each step. Instead a commitment of the state (e.g. Merkle root) can be recorded instead.

The second applies when there are two conflicting parties in dispute about the result of executing a program. A two-party protocol can be used to reduce the trace down to the first instruction that the parties disagree upon the result of. A third trusted arbitrator (usually a blockchain runtime) can then execute only a single instruction in the trace resolve a dispute over an entire program.

This last trick of framing the dispute as being between two parties allows proving faults in programs in a number of steps that is logarithmic in the length of the trace, followed by the execution of a single instruction. This is incredibly powerful and has been developed by Arbitrum and the Optimism Bedrock prototype for proving rollup state transitions, along with Cartesi for proving arbitrary computations on-chain.

### Problems

The problem with this approach as described is that once two players are engaged in a dispute they must both remain live in order to resolve it. There is also no way to ensure that both participants are honest so it must be possible for multiple disputes to be open on a single claim at once for the honest minority assumption to hold.

A malicious challenger may open many dispute games on a single assertion and although they will lose their bond if they have more available funds than the defender they can eventually prevent them from being able to participate. I have written about this issue in [another article][4].

The usual solution to this is to limit who can participate in dispute games. This is the approach used by Arbitrum and the Optimism Bedrock prototype. This compromise places these dispute game systems in an in-between trusted federation and fully permissionless dispute games.

## Permissionless Bisection Dispute Games

So can bisection style dispute games be made fully permissionless? A recent [paper by Nehab and Teixeira][1] proposes a modification to the dispute games where the participants must submit a vector commitment to the entire execution trace before the game begins. Once this has been done the game becomes permissionless as anyone can submit a step along with its inclusion proof.

This is an excellent solution however it has a major drawback. Execution traces are incredibly large, commonly several trillion instructions. Producing a merkle tree and associated proofs for such a long vector is prohibitive in most cases. The authors solution to this is to split the trace into stages and run 

More recently Optimism has proposed [another design][3] which structures dispute game is structured as an n-degree tree rather than a binary tree. This allows other participants to fork off an existing dispute game when they believe participants to be fraudulent. 

Bond is added incrementally at each step of the tree allowing permissionless participation. Once a game has concluded the player who asserted correctly against any branch that has been proven false can collect the bond on each of those nodes in the tree.

This design gives the best of both worlds allowing permissionless participation without needing to compute trace commitments. This is at the cost of increased complexity in implementation.

## Conclusion

Dispute games are conceptually simple but designing them to be permissionless is much more challenging. Despite dispute games being proposed for use in blockchain systems more than 5 years ago, and claiming to be permissionless, there has not been a single permissionless dispute game used in production.

Optimism has made excellent progress in the last year design dispute games that can be safe and permissionless and these will hopefully be deployed in production in the near future.

[1]: https://www.usenix.org/system/files/conference/usenixsecurity18/sec18-kalodner.pdf "Arbitrum: Scalable, private smart contracts"
[2]: https://arxiv.org/pdf/2212.12439.pdf "Permissionless Refereed Tournaments"
[3]: https://www.youtube.com/watch?v=GaLm4iXOtOo&t=1392s& "Keys in Mordor Summit: Dispute Games"
[4]: https://willemolding.github.io/blog/attacks-permissionless-fraud "Some Attacks on Optimistic Systems"
[5]: https://near.org/blog/eth-near-rainbow-bridge "Eth-NEAR Rainbow Bridge"
[6]: https://fuel-labs.ghost.io/introducing-hybrid-proving/ "Fuel Labs - Hybrid proving"
