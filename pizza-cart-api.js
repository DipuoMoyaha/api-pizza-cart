document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {
        init(){

          axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
          .then((result) => {

           this.pizzas=result.data.pizzas
        })
        .then(() => {
          return this.createCart();
         
        })
        .then((result) => {
          this.cartId = result.data.cart_code;
        });
      
      },

      createCart(){
        return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
      },

      showCart(){
        const url =`https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
        axios
          .get(url)
          .then((result) => {
           this.cart=result.data;
        });
      },
      
      

      pizzaImage(pizza){
        return `/img/${pizza.size}.jpg`
      },

       message: '', 
       pizzas: [],
       username: '',
       cartId: '',
       cart: { total:0 },
       removeMessage: '',
       paymentMessage:'',
       paymentAmount:0,
       Checkout: true,
      
       
      

       add(pizza){
        const parameters = {
        cart_code:this.cartId,
        pizza_id:pizza.id
        }
        axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', parameters)
        .then(() =>{
         this.message='Added pizza to the cart!'
         this.showCart();
        })
        setTimeout(()=> {
          this.message='';
          }, 3000)
      },

         remove(pizza){
          const parameters = {
            cart_code:this.cartId,
            pizza_id:pizza.id
          }
         axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', parameters)
         .then(()=>{
          this.message='Pizza removed from the cart!'
          this.showCart();
         })
         setTimeout(()=> {
          this.message='';
          }, 3000)
       },

    

       pay(){
        const parameter ={
          cart_code:this.cartId,
        }
        axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', parameter)
        .then(()=>{
          if (!this.paymentAmount){
            this.paymentMessage='Please Enter Amount!'
          }
          else if (this.paymentAmount>=this.cart.total.toFixed(2)){
            this.paymentMessage = 'Successful payment, Order is received for ' + this.username + '!';
            setTimeout(()=> {
              this.cart.total=0;
              this.paymentMessage='';
              this.paymentAmount=0;
              this.username='';
              window.location.reload()
                      }, 5000)
          }
          else if(this.paymentAmount<this.cart.total){
            this.paymentMessage='Insufficient funds! Please try again.'
          }
        })
       },
      
}

      
    })
})