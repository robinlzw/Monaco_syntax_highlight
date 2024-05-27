

const code = `// Copyright (c) Mysten Labs, Inc.
 // SPDX-License-Identifier: Apache-2.0
 
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
 
     /// An EarmarkedPayment payment is an IdentifiedPayment that is
     /// earmarked for a specific address. E.g., in the restaurant example, you
     /// may tip your serverd with an EarmarkedPayment which will ensure that only
     /// server that you specified in your tip can receive it.
     /// Since this object is key only it can only be transferred and
     /// received by functions defined in this module.
     public struct EarmarkedPayment has key {
         id: UID,
         payment: IdentifiedPayment,
         for: address,
     }
 
     /// Event emitted when a payment is made. This contains the payment_id
     /// that the payment is being made for, the payment_amount that is being made,
     /// and the originator of the payment.
     public struct SentPaymentEvent has copy, drop {
         payment_id: u64,
         paid_to: address,
         payment_amount: u64,
         originator: address,
     }
 
     /// Event emitted when a payment is processed. This contains the
     /// payment_id of the payment, and the amount processed.
     public struct ProcessedPaymentEvent has copy, drop {
         payment_id: u64,
         payment_amount: u64,
     }
 
     /// Make a payment with the given payment ID to the provided to address.
     /// Will create an IdentifiedPayment object that can be unpacked by the
     /// recipient, and also emits an event.
     public fun make_payment(payment_id: u64, coin: Coin<SUI>, to: address, ctx: &mut TxContext) {
         let payment_amount = coin::value(&coin);
         let identified_payment = IdentifiedPayment {
             id: object::new(ctx),
             payment_id,
             coin,
         };
         event::emit(SentPaymentEvent {
             payment_id,
             paid_to: to,
             payment_amount,
             originator: tx_context::sender(ctx),
         });
         transfer::transfer(identified_payment, to);
     }
 
     /// Only needed for the non transfer-to-object-based cash register.
     public fun make_shared_payment(register_uid: &mut UID, payment_id: u64, coin: Coin<SUI>, ctx: &mut TxContext) {
         let payment_amount = coin::value(&coin);
         let identified_payment = IdentifiedPayment {
             id: object::new(ctx),
             payment_id,
             coin,
         };
         event::emit(SentPaymentEvent {
             payment_id,
             paid_to: object::uid_to_address(register_uid),
             payment_amount,
             originator: tx_context::sender(ctx),
         });
         dynamic_field::add(register_uid, payment_id, identified_payment)
     }
 
     /// Process an IdentifiedPayment payment returning back the payments ID,
     /// along with the coin that was sent in the payment.
     public fun unpack(identified_payment: IdentifiedPayment): (u64, Coin<SUI>) {
         let IdentifiedPayment { id, payment_id, coin } = identified_payment;
         object::delete(id);
         event::emit(ProcessedPaymentEvent {
             payment_id,
             payment_amount: coin::value(&coin),
         });
         (payment_id, coin)
     }
 
     //---------------------------------------------------------------------------
     // Functions for EarmarkedPayments
     //---------------------------------------------------------------------------
 
     /// Custom transfer rule for EarmarkedPayment payments -- anyone can transfer them.
     public fun transfer(earmarked: EarmarkedPayment, to: address) {
         transfer::transfer(earmarked, to);
     }
 
     /// An example of a custom receiving rule -- this behaves in a similar manner
     /// to custom transfer rules: if the object is key only , the
     /// sui::transfer::receive function can only be called on the object from
     /// within the same module that defined that object.
     ///
     /// In this case EarmarkedPayment is defined with key only, so this is
     /// defining a custom receive rule that specifies that only for can receive
     /// the payment no matter what object it was sent to.
     public fun receive(parent: &mut UID, ticket: Receiving<EarmarkedPayment>, ctx: &TxContext): IdentifiedPayment {
         let EarmarkedPayment { id, payment, for } = transfer::receive(parent, ticket);
         assert!(tx_context::sender(ctx) == for, ENotEarmarkedForSender);
         object::delete(id);
         payment
     }
 }

 module suiversary::suiversary {
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::clock::Clock;
    use sui::package;
    use sui::display;
    
    #[allow(lint(coin_field))]
    public struct Suiversary has key, store {
        id: UID,
        coin: Coin<SUI>,
        number: u8,
        minted_timestamp: u64,
    }

    public struct Registry has key {
        id: UID,
        supply: u8,
        pow_supply: u8,
    }

    public struct SuiversaryMintedEvent has copy, store, drop {
        nft_id: ID,
        coin_id: ID,
        sender: address,
        timestamp: u64,
    }

    public struct SuiversaryBurnedEvent has copy, drop {
        number: u8,
        sender: address,
    }

    const MAX_SUPPLY: u8 = 10;
    const MAX_POW_SUPPLY: u8 = 100;

    public struct SUIVERSARY has drop {}

    fun init(otw: SUIVERSARY, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        let mut suiversary_display = display::new<Suiversary>(&publisher, ctx);
        suiversary_display.add(b"name".to_string(), b"Suiversary #{number}".to_string());
        suiversary_display.add(b"description".to_string(), b"One year and counting..".to_string());
        suiversary_display.add(b"image_url".to_string(), b"ipfs://bafkreifirsanoskhxukfjqttt7rylthzmwa766xdanrkzl52zz6mslksya".to_string());
        transfer::public_transfer(suiversary_display, ctx.sender());
        transfer::public_transfer(publisher, ctx.sender());

        let registry = Registry {
            id: object::new(ctx),
            supply: 0,
            pow_supply: 0,
        };
        
        transfer::share_object(registry);
    }

    #[allow(lint(self_transfer))]
    public fun mint(registry: &mut Registry, coin: Coin<SUI>, clock: &Clock, ctx: &mut TxContext) {        
        assert!(registry.supply < MAX_SUPPLY, 0);
        registry.supply = registry.supply + 1;

        assert!(coin.value() == 1_000_000_000, 1); // exactly 1 SUI, to mark 1st year anniv

        let coin_id = object::id(&coin);
        let suiversary = Suiversary {
            id: object::new(ctx),
            coin: coin,
            number: registry.supply + registry.pow_supply,
            minted_timestamp: clock.timestamp_ms() / 1000, // in second
        };

        sui::event::emit(SuiversaryMintedEvent {
            nft_id: object::id(&suiversary),
            coin_id: coin_id,
            sender: ctx.sender(),
            timestamp: clock.timestamp_ms() / 1000,
        });
        
        transfer::transfer(suiversary, ctx.sender())
    }

    #[allow(lint(self_transfer))]
    public fun mint_pow(registry: &mut Registry, coin: Coin<SUI>, clock: &Clock, ctx: &mut TxContext) {        
        assert!(registry.supply == MAX_SUPPLY, 1); // only start minting after initial supply is done
        assert!(registry.pow_supply < MAX_POW_SUPPLY, 2);
        registry.pow_supply = registry.pow_supply + 1;

        assert!(coin.value() == 1_000_000_000, 3); // exactly 1 SUI, to mark 1st year anniv
        let coin_id = object::id(&coin);
        proof(&coin_id);

        let suiversary = Suiversary {
            id: object::new(ctx),
            coin: coin,
            number: registry.supply + registry.pow_supply,
            minted_timestamp: clock.timestamp_ms() / 1000, // in second
        };

        sui::event::emit(SuiversaryMintedEvent {
            nft_id: object::id(&suiversary),
            coin_id: coin_id,
            sender: ctx.sender(),
            timestamp: clock.timestamp_ms() / 1000,
        });
        
        transfer::transfer(suiversary, ctx.sender())
    }

    #[allow(lint(self_transfer))]
    public fun burn(suiversary: Suiversary, ctx: &mut TxContext) {
        let Suiversary { id, coin, number, minted_timestamp: _ } = suiversary;
        sui::event::emit(SuiversaryBurnedEvent {
            number,
            sender: ctx.sender(),
        });
        object::delete(id);
        transfer::public_transfer(coin, ctx.sender());
    }

    fun proof(id: &ID) {
        let str = &sui::address::to_string(object::id_to_address(id));
        let sub_str = std::string::sub_string(str, 0, 4);
        assert!(std::string::utf8(b"0000") == sub_str, 0);
    }

    #[test]
    fun proof_test() {
        proof(&object::id_from_address(@0x0000888bcc686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
        proof(&object::id_from_address(@0x0000000bcc686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
        proof(&object::id_from_address(@0x0000000000686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
    }

    #[test, expected_failure(abort_code = 0, location = suiversary::suiversary)]
    fun proof_failed_test() {
        proof(&object::id_from_address(@0x1000000bcc686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
    }
}

module a::shapes {

    public struct Rectangle { base: u64, height: u64 }
    public struct Box { base: u64, height: u64, depth: u64 }

    public fun rectangle(base: u64, height: u64): Rectangle {
        Rectangle { base, height }
    }

    // Rectangle and Box can have methods with the same name

    public use fun rectangle_base as Rectangle.base;
    public fun rectangle_base(rectangle: &Rectangle): u64 {
        rectangle.base
    }

    public use fun rectangle_height as Rectangle.height;
    public fun rectangle_height(rectangle: &Rectangle): u64 {
        rectangle.height
    }

    public fun box(base: u64, height: u64, depth: u64): Box {
        Box { base, height, depth }
    }

    public use fun box_base as Box.base;
    public fun box_base(box: &Box): u64 {
        box.base
    }

    public use fun box_height as Box.height;
    public fun box_height(box: &Box): u64 {
        box.height
    }

    public use fun box_depth as Box.depth;
    public fun box_depth(box: &Box): u64 {
        box.depth
    }
}

// Public Use Fun
//这部分代码展示了如何使用 public use fun 来创建公共的方法别名。这些别名允许在不同的模块中以不同的名称调用相同的函数。在这个例子中，
//Rectangle 和 Box 结构体有相同名称的方法（base 和 height），但是通过 public use fun，我们可以为它们创建不同的别名，然后在
 //example 函数中使用这些别名来访问结构体的字段。
module b::examples1 {
    use a::shapes::{Rectangle, Square};

    // Example using a public use fun
    fun example(rectangle: &Rectangle, box: &Box): u64 {
        (rectangle.base() * rectangle.height()) +
        (box.base() * box.height() * box.depth())
    }

    // Same example but with the method calls expanded
    fun expanded_example(rectangle: &Rectangle, box: &Box): u64 {
        (a::shapes::rectangle_base(rectangle) *
        a::shapes::rectangle_height(rectangle)) +
        (a::shapes::box_base(box) *
        a::shapes::box_height(box) *
        a::shapes::box_depth(box))
    }
}

// Use Fun
// 如何使用 use fun 来创建局部的方法别名。这些别名只在定义它们的模块中有效。在这个例子中，
// into_box 被定义为一个别名，它实际上是一个将 Rectangle 转换为 Box 的函数。
// 在 example 函数中，我们可以直接在 Rectangle 上调用 into_box 方法，而不是显式地调用 a::shapes::box 函数
module b::examples2 {
    use a::shapes::{Rectangle, Box};

    use fun into_box as Rectangle.into_box;
    fun into_box(rectangle: &Rectangle, depth: u64): Box {
        a::shapes::box(rectangle.base(), rectangle.height(), depth)
    }

    // Example using a local use fun
    fun example(rectangle: &Rectangle): Box {
        rectangle.into_box(1)
    }

    // Same example but with the method calls expanded
    fun expanded_example(rectangle: &Rectangle): Box {
        into_box(rectangle, 1)
    }
}

//  Uses Create Implicit Use Funs
// 在使用 use 导入函数时隐式创建方法别名。当函数的第一个参数是当前模块中定义的类型的引用时，Move 会自动创建一个方法别名。
// 在这个例子中，我们使用 use 导入了 rectangle_base 和 rectangle_height 函数，
// 并为它们创建了别名 b 和 h。然后我们可以在 example 函数中像调用方法一样使用这些别名
module b::examples3 {
    use a::shapes::Rectangle;

    // Example using a local use fun
    fun example(rectangle: &Rectangle): u64 {
        use a::shapes::{rectangle_base as b, rectangle_height as h};
        // implicit 'use fun a::shapes::rectangle_base as Rectangle.b'
        // implicit 'use fun a::shapes::rectangle_height as Rectangle.h'
        rectangle.b() * rectangle.h()
    }

    // Same example but with the method calls expanded
    fun expanded_example(rectangle: &Rectangle): Box {
        a::shapes::rectangle_base(rectangle) * 
        a::shapes::rectangle_height(rectangle)
    }
}


module a::cup {
    public struct Cup<T> { value: T }

    public fun borrow<T>(cup: &Cup<T>): &T { &cup.value }
    public fun borrow_mut<T>(cup: &mut Cup<T>): &mut T { &mut cup.value }
    public fun value<T>(cup: Cup<T>): T { let Cup { value } = cup; value }
}

module b::examples4 {
    use a::cup::Cup;

    // Examples showing the three cases for how a value is used
    fun examples<T>(mut cup: Cup<T>): T {
        // The type annotations are not necessary, but here for clarity.
        // automatic immutable borrow
        let _: &T = cup.borrow();
        // automatic mutable borrow
        let _: &mut T = cup.borrow_mut();
        // no borrow needed
        cup.value()
    }

    // 没有使用自动借用语法
    fun expanded_examples<T>(mut cup: Cup<T>): T {
        let _: &T = a::cup::borrow(&cup);
        let _: &mut T =  a::cup::borrow_mut(&mut cup);
        a::cup::value(cup)
    }
}

     `

const code2 = `
module suiversary::suiversary {
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::clock::Clock;
    use sui::package;
    use sui::display;
    
    #[allow(lint(coin_field))]
    public struct Suiversary has key, store {
        id: UID,
        coin: Coin<SUI>,
        number: u8,
        minted_timestamp: u64,
    }

    public struct Registry has key {
        id: UID,
        supply: u8,
        pow_supply: u8,
    }

    public struct SuiversaryMintedEvent has copy, store, drop {
        nft_id: ID,
        coin_id: ID,
        sender: address,
        timestamp: u64,
    }

    public struct SuiversaryBurnedEvent has copy, drop {
        number: u8,
        sender: address,
    }

    const MAX_SUPPLY: u8 = 10;
    const MAX_POW_SUPPLY: u8 = 100;

    public struct SUIVERSARY has drop {}

    fun init(otw: SUIVERSARY, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        let mut suiversary_display = display::new<Suiversary>(&publisher, ctx);
        suiversary_display.add(b"name".to_string(), b"Suiversary #{number}".to_string());
        suiversary_display.add(b"description".to_string(), b"One year and counting..".to_string());
        suiversary_display.add(b"image_url".to_string(), b"ipfs://bafkreifirsanoskhxukfjqttt7rylthzmwa766xdanrkzl52zz6mslksya".to_string());
        transfer::public_transfer(suiversary_display, ctx.sender());
        transfer::public_transfer(publisher, ctx.sender());

        let registry = Registry {
            id: object::new(ctx),
            supply: 0,
            pow_supply: 0,
        };
        
        transfer::share_object(registry);
    }

    #[allow(lint(self_transfer))]
    public fun mint(registry: &mut Registry, coin: Coin<SUI>, clock: &Clock, ctx: &mut TxContext) {        
        assert!(registry.supply < MAX_SUPPLY, 0);
        registry.supply = registry.supply + 1;

        assert!(coin.value() == 1_000_000_000, 1); // exactly 1 SUI, to mark 1st year anniv

        let coin_id = object::id(&coin);
        let suiversary = Suiversary {
            id: object::new(ctx),
            coin: coin,
            number: registry.supply + registry.pow_supply,
            minted_timestamp: clock.timestamp_ms() / 1000, // in second
        };

        sui::event::emit(SuiversaryMintedEvent {
            nft_id: object::id(&suiversary),
            coin_id: coin_id,
            sender: ctx.sender(),
            timestamp: clock.timestamp_ms() / 1000,
        });
        
        transfer::transfer(suiversary, ctx.sender())
    }

    #[allow(lint(self_transfer))]
    public fun mint_pow(registry: &mut Registry, coin: Coin<SUI>, clock: &Clock, ctx: &mut TxContext) {        
        assert!(registry.supply == MAX_SUPPLY, 1); // only start minting after initial supply is done
        assert!(registry.pow_supply < MAX_POW_SUPPLY, 2);
        registry.pow_supply = registry.pow_supply + 1;

        assert!(coin.value() == 1_000_000_000, 3); // exactly 1 SUI, to mark 1st year anniv
        let coin_id = object::id(&coin);
        proof(&coin_id);

        let suiversary = Suiversary {
            id: object::new(ctx),
            coin: coin,
            number: registry.supply + registry.pow_supply,
            minted_timestamp: clock.timestamp_ms() / 1000, // in second
        };

        sui::event::emit(SuiversaryMintedEvent {
            nft_id: object::id(&suiversary),
            coin_id: coin_id,
            sender: ctx.sender(),
            timestamp: clock.timestamp_ms() / 1000,
        });
        
        transfer::transfer(suiversary, ctx.sender())
    }

    #[allow(lint(self_transfer))]
    public fun burn(suiversary: Suiversary, ctx: &mut TxContext) {
        let Suiversary { id, coin, number, minted_timestamp: _ } = suiversary;
        sui::event::emit(SuiversaryBurnedEvent {
            number,
            sender: ctx.sender(),
        });
        object::delete(id);
        transfer::public_transfer(coin, ctx.sender());
    }

    fun proof(id: &ID) {
        let str = &sui::address::to_string(object::id_to_address(id));
        let sub_str = std::string::sub_string(str, 0, 4);
        assert!(std::string::utf8(b"0000") == sub_str, 0);
    }

    #[test]
    fun proof_test() {
        proof(&object::id_from_address(@0x0000888bcc686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
        proof(&object::id_from_address(@0x0000000bcc686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
        proof(&object::id_from_address(@0x0000000000686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
    }

    #[test, expected_failure(abort_code = 0, location = suiversary::suiversary)]
    fun proof_failed_test() {
        proof(&object::id_from_address(@0x1000000bcc686d9e1db846e8f06f34c9de6059b632970163278fdf6d9777e547));
    }
}

module a::shapes {

    public struct Rectangle { base: u64, height: u64 }
    public struct Box { base: u64, height: u64, depth: u64 }
    public struct cclowercaseletters { base: u64 }
    public fun rectangle(base: u64, height: u64): Rectangle {
        Rectangle { base, height }
    }

    // Rectangle and Box can have methods with the same name

    public use fun rectangle_base as Rectangle.base;
    public fun rectangle_base(rectangle: &Rectangle): u64 {
        rectangle.base
    }

    public use fun rectangle_height as Rectangle.height;
    public fun rectangle_height(rectangle: &Rectangle): u64 {
        rectangle.height
    }

    public fun box(base: u64, height: u64, depth: u64): Box {
        Box { base, height, depth }
    }

    public use fun box_base as Box.base;
    public fun box_base(box: &Box): u64 {
        box.base
    }

    public use fun box_height as Box.height;
    public fun box_height(box: &Box): u64 {
        box.height
    }

    public use fun box_depth as Box.depth;
    public fun box_depth(box: &Box): u64 {
        box.depth
    }
}

// Public Use Fun
//这部分代码展示了如何使用 public use fun 来创建公共的方法别名。这些别名允许在不同的模块中以不同的名称调用相同的函数。在这个例子中，
//Rectangle 和 Box 结构体有相同名称的方法（base 和 height），但是通过 public use fun，我们可以为它们创建不同的别名，然后在
 //example 函数中使用这些别名来访问结构体的字段。
module b::examples1 {
    use a::shapes::{Rectangle, Square};

    // Example using a public use fun
    fun example(rectangle: &Rectangle, box: &Box): u64 {
        (rectangle.base() * rectangle.height()) +
        (box.base() * box.height() * box.depth())
    }

    // Same example but with the method calls expanded
    fun expanded_example(rectangle: &Rectangle, box: &Box): u64 {
        (a::shapes::rectangle_base(rectangle) *
        a::shapes::rectangle_height(rectangle)) +
        (a::shapes::box_base(box) *
        a::shapes::box_height(box) *
        a::shapes::box_depth(box))
    }
}

// Use Fun
// 如何使用 use fun 来创建局部的方法别名。这些别名只在定义它们的模块中有效。在这个例子中，
// into_box 被定义为一个别名，它实际上是一个将 Rectangle 转换为 Box 的函数。
// 在 example 函数中，我们可以直接在 Rectangle 上调用 into_box 方法，而不是显式地调用 a::shapes::box 函数
module b::examples2 {
    use a::shapes::{Rectangle, Box, cclowercaseletters};

    use fun into_box as Rectangle.into_box;
    fun into_box(rectangle: &Rectangle, depth: u64): Box {
        a::shapes::box(rectangle.base(), rectangle.height(), depth)
    }

    // Example using a local use fun
    fun example(rectangle: &Rectangle): Box {
        rectangle.into_box(1)
    }

    // Same example but with the method calls expanded
    fun expanded_example(rectangle: &Rectangle): Box {
        into_box(rectangle, 1)
    }
}

//  Uses Create Implicit Use Funs
// 在使用 use 导入函数时隐式创建方法别名。当函数的第一个参数是当前模块中定义的类型的引用时，Move 会自动创建一个方法别名。
// 在这个例子中，我们使用 use 导入了 rectangle_base 和 rectangle_height 函数，
// 并为它们创建了别名 b 和 h。然后我们可以在 example 函数中像调用方法一样使用这些别名
module b::examples3 {
    use a::shapes::Rectangle;

    // Example using a local use fun
    fun example(rectangle: &Rectangle): u64 {
        use a::shapes::{rectangle_base as b, rectangle_height as h};
        // implicit 'use fun a::shapes::rectangle_base as Rectangle.b'
        // implicit 'use fun a::shapes::rectangle_height as Rectangle.h'
        rectangle.b() * rectangle.h()
    }

    // Same example but with the method calls expanded
    fun expanded_example(rectangle: &Rectangle): Box {
        a::shapes::rectangle_base(rectangle) * 
        a::shapes::rectangle_height(rectangle)
    }
}


module a::cup {
    public struct Cup<T> { value: T }

    public fun borrow<T>(cup: &Cup<T>): &T { &cup.value }
    public fun borrow_mut<T>(cup: &mut Cup<T>): &mut T { &mut cup.value }
    public fun value<T>(cup: Cup<T>): T { let Cup { value } = cup; value }
}

module b::examples4 {
    use a::cup::Cup;

    // Examples showing the three cases for how a value is used
    fun examples<T>(mut cup: Cup<T>): T {
        // The type annotations are not necessary, but here for clarity.
        // automatic immutable borrow
        let _: &T = cup.borrow();
        // automatic mutable borrow
        let _: &mut T = cup.borrow_mut();
        // no borrow needed
        cup.value()
    }

    // 没有使用自动借用语法
    fun expanded_examples<T>(mut cup: Cup<T>): T {
        let _: &T = a::cup::borrow(&cup);
        let _: &mut T =  a::cup::borrow_mut(&mut cup);
        a::cup::value(cup)
    }
}
`

const code3 = `
module a::cup {
    public struct Cup<T> { value: T }

    public fun borrow<T>(cup: &Cup<T>): &T { &cup.value }
    public fun borrow_mut<T>(cup: &mut Cup<T>): &mut T { &mut cup.value }
    public fun value<T>(cup: Cup<T>): T { let Cup { value } = cup; value }
}

module b::examples4 {
    use a::cup::Cup;

    // Examples showing the three cases for how a value is used
    fun examples<T>(mut cup: Cup<T>): T {
        // The type annotations are not necessary, but here for clarity.
        // automatic immutable borrow
        let _: &T = cup.borrow();
        // automatic mutable borrow
        let _: &mut T = cup.borrow_mut();
        // no borrow needed
        cup.value()
    }

    // 没有使用自动借用语法
    fun expanded_examples<T>(mut cup: Cup<T>): T {
        let _: &T = a::cup::borrow(&cup);
        let _: &mut T =  a::cup::borrow_mut(&mut cup);
        a::cup::value(cup)
    }
}
`
export default code3