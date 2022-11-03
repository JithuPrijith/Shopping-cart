
    function addToCart(productId){
        $.ajax({
            url : '/add-to-cart/'+productId,
            method : 'get',
            success : (response) => {
                 console.log(response.products)
                if(response.products){
                    let count = $('#cart-count').html()
                    count = parseInt(count) + 1
                    $('#cart-count').html(count)
                }
            }
        })
    }
