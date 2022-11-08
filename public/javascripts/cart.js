
    function changeQuantity(productId, value,price) {
        $.ajax({
            url: '/change-quantity',
            data: {
                product: productId,
                count: value,
            },
            method: 'post',
            success: (response) => {
                let productsArray = response.products;
                let productDetails = productsArray.filter((val) => { return val.productId == productId})
                let quantity = productDetails[0].quantity
                document.getElementById(productId).innerHTML = quantity;
                document.getElementById('total-price').innerHTML = response.totalAmount.totalPrice[0].total;
            }
        })
    }





    function removeFromCart(productId) {
        $.ajax({
            url: '/remove-from-cart/' + productId,
            method: 'get',
            success: (response) => {
                if (response.status) {
                    $.ajax({
                        url: '/cart',
                        method: 'get',
                        success: (response) => {
                            var success = $($.parseHTML(response)).filter("#parent");
                            $('#parent').html(success)
                            let count = $('#cart-count').html()
                            count =  count - 1
                            $('#cart-count').html(count)
                        }
                    })
                }
                
            }

        })
    }
