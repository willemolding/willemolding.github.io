---
title: Some Attacks on Optimistic Systems
slug: attacks-permissionless-fraud
authors: willem
tags: [fault-proofs, rollups]
---

# Some Attacks on Optimistic Systems

In theory optimistic systems promise an honest minority assumption. Any actor can watch the state of the system progress and report fraud by challenging a particular state transition. This comes with the guarantee that they will always win a challenge game against an invalid state transition.

In practice though many of the optimistic rollups in production do not currently have this property. In Arbitrum for example the ability to challenge state transitions is limited to a permissioned validator set[^1]. 

I spent some time thinking about some potential attacks against permissionless optimistic systems and, at least for the model system I considered, it appears the honest minority assumption comes with some strings attached when real world considerations such as gas costs come into play.

## Model System

Lets consider an abstracted optimistic system. This is not a rollup but rather a general iterative computation without inputs. Each state can be transitioned to the next state by executing the state transition function. 

You could consider such a system similar to a programming loop with the state being the loop variables and  for each execution of the loop code the hash of the new loop state is submitted on-chain. 

The challenge game itself has the following properties:

-  Anyone can submit a new state commitment at a given sequence number (permissionless updates). This requires including a bond $B$
-  The first state commitment to have no open challenges after the finalization period, $T_{final}$, becomes finalized. Other submissions for the same sequence number are discarded and their bonds slashed.
-  Anyone can challenge an update that has not finalized (permissionless challenges). This also requires submitting a bond $B$. The submitter and the challenger are now in a challenge game.
-  No new challenges can be submitted after $T_{final}$. This prevents stalling attacks.
-  Any number of challenges can be opened on an update at once. This is required to ensure the honest minority assumption. If only a limited number of challenges are allowed then dishonest challengers could occupy all the slots.
-  The challenge game is a 2-party interactive game and requires on-chain submissions by both the defender (formerly submitter) and challenger. The gas cost for the defender is $g_d$ and for the challenger is $g_c$. Each participant has time to respond $T_{chal}$. 
-  The winner of a challenge game receives half of the losers bond. The remainder of the loser bond is burnt.

Lets also define some properties of the host chain:

- Each block has a gas limit $G$
- The block time is $t_{block}$
- A stable gas price of $p$

## First Attack - Challenger DoS

This one is nothing new but will serve as a good first example using our model.

For this attack a malicious submitter submits an invalid state transition. They then prevent any challenger from challenging them by purchasing enough blockspace that the challenge transaction cannot fit for every block in the finalization period $T_{final}$. The cost of this attack is

$$
c = (G - g_c) \frac{T_{final}}{t_{block}} p 
$$

It can be seen that the only system specific parameters this depends on is the finalization time and the gas cost of a challenge response. Since the gas cost is usually fixed this attack is typically protected against by using a very large finalization time (e.g. 7 days).

The finalization time should be selected such that the cost of executing the attack exceeds the exploitable value ever expected to be held in the system.

## Second Attack - Challenge Flooding

This is an attack on an honest submitter. It is designed to steal their stake and delay finalization of the system.

It works by a malicious challenger submitting many ($N$) challenges on a single valid submission. The defender must respond to all of these challenges in order to defend their bond. The attack succeeds if the defender does not have sufficient funds to pay the gas to respond to all these challenges. Because the challenges are overlapping the defender cannot use the winnings from one to pay the gas for the others [^2].

The cost of this attack to the challenger depends on if it succeeds or fails. If it succeeds the challenger receives the defenders bond and prevents the update from finalizing. If it succeeds the cost is

$$
c = N p g_{c}.
$$

If it fails the cost to the challenger is

$$
c = N (B + p g_{d})
$$

and the defender wins $\frac{N B}{2}$. There is also a possibility of partial success where the defender can take some of the challenges but not others.

The conditions for this attack to be possible require an attacker with vastly more funds than the defender. The capital required to conduct this attack is

$$
C_{attack} = N (B +p  g_{c})
$$

and to defend against it is

$$
C_{defend} = N p g_{d}
$$

and so to successfully conduct this attack requires an attacker with more funds than the defender by a factor of

$$
\frac{B + p g_{c}}{p g_d}.
$$

The implications for this are quite significant. If we consider the existence of mega-whales (like Coinbase). These actors could successfully conduct this attack at a very low cost on almost any submitter. By doing this repeatedly they can prevent any valid updates from being accepted and stall the system. 

If we assume the gas costs cannot be changed the only way to mitigate this attack is to increase the bond size. With a sufficiently large bond relative to the defender gas cost this simultaneously limits which actors are able to make this attack while also limiting the accounts that can participate at all.

From this I conclude that for the described system the unbounded honest minority assumption does not hold. It should be reduced to an honest minority in the set of accounts with funds within a factor of $\frac{p g_d}{B+ p g_{c}}$ of the largest gas token holder.

## Looking Forward

A recent article [^3] was published (after I wrote this blog post!) that proposes a modification to the interactive game that could allow honest actors to band together and share the gas costs. See my next article for how this could be used to protect against the challenge flooding attack.

[^1]: https://l2beat.com/scaling/projects/arbitrum/
[^2]: At first glance one might think that the submitter could use the reward from one challenge game to pay the gas of the next one. This would be true if the challenge game was single-step (e.g. non-interactive) however the additional timeout period introduced by the interactive game means that the defender must wait to receive their half of the challengers bond and in this time they must respond to the other challenges or risk losing the interactive game through a timeout.
[^3]: https://arxiv.org/pdf/2212.12439.pdf