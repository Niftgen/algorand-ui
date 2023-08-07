### Introduction:

This section highlights the history of blockchain technology without going too much into the technicalities of the technology. To get more details on how the technology works, see documentation [“What is blockchain.”](https://www.niftgen.com/?page=support)

### Origin:

While today blockchain technology is mostly associated with Satoshi Nakamoto and Bitcoin, its origin can actually be traced back to 1991, when the physicist Stuart Haber and the cryptographer W Scott Stornetta released their seminal research paper “How to time-stamp a digital document.

In this paper, Haber and Stornetta outlined and discussed some of the foundational principles of blockchain technology - **immutability, time-stamp, and validation**.

1. **Immutability** was to ensure that the digital documents or records could not be tampered with and changed at will, thus protecting the integrity of the blockchain.
2. **Timestamp** allowed blockchain users to see exactly when the digital documents/records were added to the blockchain
3. The time -stamp was also part of the **validation/verification process**, whereby users could verify/validate the originality of the records/documents.

### Later Years

Then, in 1998, seven years after Haber and Stornetta published their paper, computer scientist Nick Szabo first formally introduced the world to the idea of a digital, decentralized (not run or backed by a central authority) currency called BitGold. He went to publish his whitepaper for the idea, building upon the ideas outlined by Haber and Stornetta, particularly that of the time-stamp. With BitGold, Szabo first demonstrated the idea of value based upon the cost of computational resources, which formed the basis of Proof-of-Work (PoW) that later powered Bitcoin.

However, the implementation of BitGold was not achieved because the value of the currency was tied directly to the cost of computation, so it ultimately went nowhere. In 2004, cryptographer Hal Finney came up with a system called Reusable Proof of Work, upon which Satoshi Nakamoto then created and conceptualized his famous Bitcoin whitepaper titled [“A Peer to Peer Electronic Cash System”](https://www.ussc.gov/sites/default/files/pdf/training/annual-national-training-seminar/2018/Emerging_Tech_Bitcoin_Crypto.pdf) in 2008.

### Satoshi Nakamoto and Bitcoin

Following “A Peer to Peer Electronic Cash System” in 2008, the Bitcoin blockchain was offered to the open-source community in 2009. The community began looking into it and realized that blockchain was a way to establish trust between different parties that had real doubts about each other. The reason that blockchain was able to do so was because it had no central authority governing it, whereby users themselves could record information in a transparent manner that was time-stamped. Bitcoin became officially a first-generation blockchain.

One of the “goals” of the Bitcoin community was to make Bitcoin the currency for the unbanked, considering that there are over 2 billion people in the world who do not have access to bank accounts. This is especially true in Africa, in a continent of 1.2 billion people, were approximately only 456 million people have a bank account. Many people in Africa cannot get bank accounts because of regulatory or government inefficiencies/corruptions. There are 800 million people who cannot open bank accounts and therefore cannot properly participate in the economy. The bitcoin community believed that Bitcoin was the answer to this problem ( implementation is complicated…)

For the next several years, Bitcoin would dominate the blockchain space not just as a first-generation blockchain, but also as a cryptocurrency. It was during this time, between 2009 and around 2014, that people began to associate blockchain technology and cryptocurrency with Bitcoin, given how influential it was in the space. This association became so powerful that even today, many people still continue to primarily associate blockchain technology and cryptocurrency with Bitcoin, despite the fact that there are dozens of other blockchains and hundreds of other cryptocurrencies.

To elaborate, cryptocurrencies are made by creating a blockchain that acts as the decentralized distributed ledger to record transactions. And it's important to note that each blockchain is independent of the others. If Bitcoin was to crash and go to zero, all the other blockchains would still remain.

Here is a list of important events in regards to early adoption of Bitcoin:

1. In 2010, programmer and early Bitcoin adopter Laszlo Hanyecz offered 10,000 Bitcoin (about $30 at the time) for two large Papa John's pizzas. Someone eventually takes him up on his offer and Hanyecz gives up his 10,000 bitcoins for two large Papa John's pizzas.
2. In 2011, WikiLeaks started accepting Bitcoin donations for the first time.
3. In 2012, Coinbase ( now the world's largest cryptocurrency exchange) raised $600,000 in its first round. The goal was to create an exchange where people could easily purchase cryptocurrencies.
4. In 2013 Coinbase claims to have sold $1 million in Bitcoin over the course of a month
5. In 2013, The first Bitcoin ATM appeared in Vancouver, Canada. This allows users to withdraw cash from the ATM by converting their Bitcoin into Canadian dollars.
6. In 2013, several years after the advent of Bitcoin, a new blockchain came onto the scene. With its release, we had now officially entered a new era of blockchain technology.

### Ethereum: The Second-Generation Blockchain

The Ethereum blockchain is the brainchild of Vitalik Buterin, a Russian-Canadian college dropout with a passion for cryptography and changing the world for the better. Buterin was the co-founder of the Bitcoin and Ethereum Magazine as well as a contributor to the Bitcoin codebase back in the day. He eventually got to a point where he realized that Bitcoin’s programming limitations created a hard ceiling for programmers such as himself.

Frustrated, he began advocating for Bitcoin to become easy to change rather than a rigid blockchain, one that would give him the programming freedom that he so craved. But Buterin’s enthusiasm was not shared by most of the other members of the Bitcoin community, so he decided to leave the Bitcoin community to establish his own blockchain. That blockchain was Ethereum.

A second-generation blockchain, Ethereum was essentially an expansion of Bitcoin. While Bitcoin was limited to just cryptocurrency when it came to recording asset transactions, Ethereum could also record loans and contracts. Ethereum was also better suited to constructing “smart contracts”, which are programs on the blockchain with predetermined conditions (contracts) that self-execute when the predetermined conditions are met (smart). See below example of a smart contract.

**All images and text from the example bellow are from the Algorand Developer Portal and properties of Algorand and/or The Algorand Foundation.**

A woman places a bid on a house using software built on top of a decentralized blockchain (see picture directly below):

![IMG_6693 2.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6693%202.PNG)

Compare this to a traditional ledger of transactional data that may live in a single database on a few computers that only certain people have access to.

A woman places a bid on a house using a private agency (see picture directly below):

![IMG_6694 2.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6694%202.PNG)

### Here is a bit of analysis:

The **“block”** part of **“blockchain”** refers to a set of transactions that are proposed and verified by the other nodes and eventually added to the ledger. The “chain” part, refers to the fact that each block of transactions also contains proof (a cryptographic hash) of what was in the previous block. This pattern of capturing the previous block’s data in the current block continues all the way back to the start of the network (the genesis block) creating a publicly verifiable and tamperproof record of all transactions, ever.

![IMG_6695.PNG](https://niftgen-algorand.github.io/docs/images/IMG_6695.PNG)

Practically, this means that if you try to change even a single record, anywhere in the history of a blockchain, it will be evident and rejected by the network nodes.

One of the main criticisms of both Bitcoin and Etherium is that they run on a consensus mechanism called proof-of-work. In brief, a consensus mechanism can be thought of as the protocol that the community agrees upon for adding new blocks/transactions to the blockchain.

In **proof-of-work**, nodes race to solve a challenging cryptographic puzzle and serve up their solution alongside a new block proposal (this is referred to as **“mining”** and these nodes are called **“miners”**). The winner is rewarded with some of the underlying currency of the system and their block becomes part of the chain. Since the blockchain becomes longer over time, as more transactions are added, the hardware required to run these cryptographic puzzles becomes greater.
The nodes also require an enormous amount of electricity to function, which can be damaging to the environment. Additionally, another major criticism of both Bitcoin and Etherium is that these blockchain can only process 8 and 45 transactions per second respectively. This led many developers both within and outside of the crypto community to the conclusion that the current blockchain models would never become scalable to achieve mass adoptions.

Here is a list of important events that showed further adoption of blockchain technology.

1. In 2014, Paypal, Microsoft, Overstock, and Expedia became early adopters and started to accept Bitcoin as a form of payment.
2. In 2015, The Nasdaq begins trying out blockchain technology to execute faster transactions

### Proof-of-Stake and the Rise of Third-Generation Blockchains

Simply put, a **proof-of-stake** blockchain gives users who have more stake (who hold more of the underlying currency in the system) more influence in proposing and validating new blocks, usually through some sort of voting mechanism. Naturally, this requires far fewer computational resources than proof-of-work as there is no need to solve complex cryptographic puzzles.

The period between 2014 till the present moment is the era of third-generation, proof-of-stake blockchains. Since 2015, third-generation, proof-of-stake blockchains such as Algorand, Cardano, Solana, Tezos, and many others have emerged. While all of these blockchains are classified as proof-of-stake, they do not all use the same exact consensus mechanism, as proof-of-stake utilizes different kinds of consensus mechanisms. For instance, Algorand uses the pure proof-of-stake (PPoS) consensus mechanism, Cardano uses the regular proof-of-stake consensus mechanism , while Solana uses a consensus mechanism called Proof of History (PoH).

Many of these were originally called “Ethereum killers”, especially by early adopters who were desperate to see a blockchain finally take on Ethereum.

However, in the past couple of years, it has become clear that the main purpose of these blockchains is not to “kill” Ethereum–which continues to thrive to this day–but rather to offer the market alternative solutions. Some of these blockchains offer users lower gas fees, better security, and faster transactions. Interestingly, Ethereum itself is now in the process of transitioning from proof-of-work to proof-of-stake through what’s known as Ethereum 2.0 Serenity.

The smart contract feature of blockchain has given rise to **Non-Fungible Tokens (NFTs)**. They are used to digitize your assets/content and create indisputable proof of ownership. They have soared in popularity over the years. Many in the blockchain community believe that NFTs will have numerous applications that will transform industries such as finance, real estate, supply chain, and much more.

While these 3rd generation blockchains started emerging, there was even more blockchain adoption.

**2017:**

1. Bitcoin became a legal tender in Japan. This means that citizens can use Bitcoin to pay their taxes, and many other things.
2. The Digital Trade Chain Consortium is created by seven European banks for the purpose of creating a blockchain-based trade finance platform.
3. By the end of 2017, about 15% of the world's banks have used blockchain technology in some capacity

**2018:**

1. The EU Commission launches the Blockchain Observatory and Forum
2. Amazon's AWS launches its Amazon Managed Blockchain service

**2019:**

1. Walmart launches a Hyperledger-based supply chain system

**2020:**

1. Deloitte's 2020 Global Blockchain Survey reveals that almost 40% of companies surveyed had used blockchain in production and 55% viewed blockchain as a top strategic priority

**2021:**

1. First Bitcoin ETF goes live
2. Beeple sells his "Everydays: The First 5000 Days" as an NFT for $69 million, setting a record
3. El Salvador officially adopts Bitcoin as legal tender
4. 6 leading cryptocurrency executives appear before the House Financial Services Committee advocating for light regulation of the industry

**2022:**

1. February - "Crypto Bowl" - The Super Bowl in the U.S., watched by an [estimated](https://www.nfl.com/news/super-bowl-lvi-total-viewing-audience-estimated-at-over-208-million) 200 million viewers on Feb. 14, saw crypto firms such as Coinbase, FTX, Crypto.com and eToro dominate advertisements.
2. May - Terra LUNA Crashes - The Terra network collapses. This was one of the first "algorithmic" stable coins
3. July - Celsius Crashes - The crypto landing company files for chapter 11 bankruptcy.
4. September - Ethereum Merge - The network became 99.99% more energy efficient by transitioning from the proof-of-work consensus mechanism to proof-of-stake.
5. November - FTX Crashes - The popular crypto exchange collapses.
