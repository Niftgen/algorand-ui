**All images and text are from the Algorand Developer Portal and properties of Algorand and/or The Algorand Foundation.**

![IMG_6692.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6692.PNG)
Photo Credit: Algorand Developer Portal

A **blockchain** is a public ledger (or file) of transactional data, distributed across multiple computers (“nodes”) in a network. All of these nodes work together, using the same set of software and rules, to verify transactions to add to the finalized ledger.

A woman places a bid on a house using software built on top of a decentralized blockchain (see picture directly below):

![IMG_6693 2.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6693%202.PNG)

Compare this to a traditional ledger of transactional data that may live in a single database on a few computers that only certain people have access to.

A woman places a bid on a house using a private agency (see picture directly below):

![IMG_6694 2.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6694%202.PNG)

The **“block”** part of “blockchain” refers to a set of transactions that are proposed and verified by the other nodes and eventually added to the ledger. The “chain” part, refers to the fact that each block of transactions also contains proof (a cryptographic hash) of what was in the previous block. This pattern of capturing the previous block’s data in the current block continues all the way back to the start of the network (the genesis block) creating a publicly verifiable and tamperproof record of all transactions, ever.

Blockchain diagram (see picture directly below):

![IMG_6695.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6695.PNG)

Practically, this means that if you try to change even a single record, anywhere in the history of a blockchain, it will be evident and rejected by the network nodes.

A malicious user attempts to change a past blockchain record, unsuccessfully (see picture directly below):

![IMG_6696.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6696.PNG)

Compare this to a traditional ledger where a change in a database is entrusted to a limited group and can easily be manipulated either through malicious intent or simply error.

Example of how a centralized system could unintentionally disqualify user participation (see picture directly below):

![IMG_6697.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6697.PNG)

But how do blocks get added to the chain in the first place? Each node runs software that instructs them how to verify transactions and add new blocks to the chain. These instructions are collectively referred to as the “consensus protocol”. The nature of these instructions are one of the main distinguishing factors of different blockchains. We will learn more about Algorand’s consensus protocol and how it differs from others’ in a separate documentation called “Why Algorand”.
