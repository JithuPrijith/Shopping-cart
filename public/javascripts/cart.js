
    function changeQuantity(productId, value) {
        $.ajax({
            url: '/change-quantity',
            data: {
                product: productId,
                count: value,
            },
            method: 'post',
            success: (response) => {
                if (response.count) {
                    let count = document.getElementById(productId).innerHTML;
                    count = parseInt(count) + parseInt(response.count);
                    document.getElementById(productId).innerHTML = count;
                }
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
