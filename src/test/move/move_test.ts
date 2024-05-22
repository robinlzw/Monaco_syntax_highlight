/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// import { testTokenization } from '../testRunner';

export const  testRule = [
	// String
	[
		{
			line: `
			#[lint_allow(coin_field)]
			module common::identified_payment {
				use sui::sui::SUI;
				use sui::coin::{Self, Coin};
				use sui::object::{Self, UID};
				use sui::transfer::{Self, Receiving};
				use sui::tx_context::{Self, TxContext};
				use sui::event;
				use sui::dynamic_field;
			
				const ENotEarmarkedForSender: u64 = 0;
			
				/// An IdentifiedPayment is an object that represents a payment that has
				/// been made for a specific good or service that is identified by a
				/// payment_i that is unique to the good or service provided for the customer.
				/// NB: This has the store ability to allow the make_shared_payment
				///     function. Without this IdentifiedPayment could be key only and
				///     custom transfer and receiving rules can be written for it.
				public struct IdentifiedPayment has key, store {
					id: UID,
					payment_id: u64,
					coin: Coin<SUI>,
				}
			`,
			tokens: [
			]
		}
	]
]
