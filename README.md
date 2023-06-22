# Omni Trade

## Table of Contents

* [Omni Trade](#omni-trade)
  * [Table of Contents](#table-of-contents)
  * [Description](#description)
  * [Usage](#usage)
    * [Requirements](#requirements)
    * [Setup and Running](#setup-and-running)
  * [Demo](#demo)

## Description

This project is an MVP Full Stack application which provides a real-time, low-latency cryptocurrency trading platform focused on beautiful and performant design. The application currently supports trading using the Kucoin exchange.

Features include:

* Live ticker tape of common cryptocurrency prices and general market information
* Real-time graphing of cryptocurrency prices and technical indicators
* Real-time orderbook price updates, including top asks and bids
* Real-time orderbook recent trades updates
* Real-time open trade and account balance updates
* Trade entry form for buying/selling cryptocurrencies with Limit/Market/Stop Limit/Stop Market order types

## Usage

### Requirements

You will need the following dependencies to run this project:

* `node` / `npm`, to manage project dependencies ([download](https://nodejs.org/en/download))
* `git`, for cloning the project ([download](https://git-scm.com/downloads))
* `Kucoin` API credentials, for accessing the Kucoin API
  * Register for an account [here](https://www.kucoin.com/r/rf/QBSY91JM)
  * Create API Key [here](https://www.kucoin.com/account/api/create?type=trade)

### Setup and Running

To run this project, please follow these steps:

1. Clone the repository to your local machine

   ```shell
   git clone https://github.com/afrodynamic/omni-trade.git
   ```

2. Navigate to the cloned repository directory

   ```shell
   cd omni-trade
   ```

3. Install the project's dependencies using `npm install` in the root of the project directory

   ```shell
   npm install
   ```

4. Create a .env file with the following variables with their values replaced with your own Kucoin credentials (see [#Requirements](#requirements))

   ```shell
   KUCOIN_API_KEY=YOUR_API_KEY
   KUCOIN_API_SECRET=YOUR_API_SECRET
   KUCOIN_API_PASSPHRASE=YOUR_API_PASSPHRASE
   ```

5. Either run both the client/server together with `npm start`

   ```shell
   npm start
   ```

   or run the client/frontend using `npm run client-dev`

   ```shell
   npm run client-dev
   ```

   and run the server/backend using `npm run server-dev`

   ```shell
   npm run server-dev
   ```

6. Open a browser and navigate to <http://localhost:1234> to view the running project

7. Optionally run the project's `jest` test suite using `npm test`

   ```shell
   npm test
   ```

## Demo

![Dashboard Page](https://drive.google.com/uc?export=download&id=1mY13Bf_SQRS3VOP5JO_BP9vExAtkcK2l)
