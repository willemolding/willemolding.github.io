---
title: What is a Pre-image Oracle and why is it awesome?
slug: preimge-oracle
authors: willem
tags: [bridges, provable computation, fraud-proofs]
---

A pre-image oracle is a way to lookup any piece of data (pre-image) by its hash. While this sounds impossible (and in the general case is) it is possible to write code assuming such a thing exists if it operates in a context where execution cannot continue unless the pre-image is provided by an external party.

<!--truncate-->

## Cannon Overview

At a high level Optimism Cannon works by compiling some computation to the MIPS instruction set (the instruction set itself isn't important, this was just the one they picked). This computation takes some input and produces some output.

A full proof of a computation could be considered as the *trace* of the execution of this code. That is the snapshot of the memory + registers (state) after the execution of each opcode from some initial state.

Proving fraud in a computation can be reduced to finding two adjacent states in the trace where both parties agree on the former state but disagree on the latter. The transition between these states can be verified by executing a single MIPS opcode to verify who is correct. This is small enough for a blockchain to execute and act as the final arbitrator.

Since the state may be large we don't want to submit the whole thing on-chain. Each snapshot can be turned into a Merkle tree and only the root hash posted on-chain. Since they are merklized it is enough just to submit the roots and additionally provide proofs for:
- The opcode.
- Any memory or registers the opcode reads from.

These can be posted on-chain by either party and one of them is always incentivised to do so (the correct one).

## What about external data?

This is where the magic of the pre-image oracle comes in. Conceptually a pre-image oracle is a magic device that can return a piece of data given its hash. You can think of this as similar to how an IPFS PID is uniquely generated from data and can be used to retrieve the data from the network. **Importantly, you can always check if the oracle is lying by hashing the provided data and ensuring it matches the hash you requested.**

In Cannon the proving code can pretend that such an oracle exists. It works as follows:

- The code places the hash of the data it wishes to access in a special memory slot
- The host environment will then magically, and instantly, place the pre-image of this hash in another designated memory range

From the code's perspective it has the ability to retrieve any data in existance given its hash. How is this possible!? 

This can be seen in the [code for reading the MIPS memory](https://github.com/ethereum-optimism/cannon/blob/dfac3fb2e09bb974e77e6563a64d898d049a2a90/contracts/MIPSMemory.sol#L201). It checks if the program is reading from the pre-defined pre-image oracle range `[0x31000000, 0x32000000]` and if so it checks that the hash of the data matches the hash in the hash stored in the special location (`0x30001000`).

It works because the host environment will simply not continue to execute if the pre-image is not provided by some actor off-chain. Since the case where the pre-image is not provided can never exist, the code can live in the happy reality where it always does.

This has an important implication:
- **If an execution requests the pre-image of a hash where the pre-image is not available then a fraud proof can never be completed.** Special care must be taken to ensure this cannot happen by ensuring the data is available in the history of the host chain (including calldata). 

But also an amazing upside:
- **Verifyable computation code can access any data in the host chain history or state including anything submitted in calldata!**