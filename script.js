
function domobj(){
  var self        =this;
  self.products   = [];

  self.getproducts = function(url){
    $.getJSON(url, function(response){
        for(i=0; i<response.sales.length ; i++){
          self.products.push( new productobj(response.sales[i], i)  );
        }
    });
  }

  self.updateproducthtml = function(){
    for( i=0; i< self.products.length ; i++){
      self.products[i].updatehtml();
    }
  }

  self.updatedom = function(){
    thishtml='';
    for( var i=0; i< self.products.length ; i++){
      thishtml += self.products[i].htmlview;
    }
    $("#content").append(thishtml)
    $('.loading').remove();
  }
}

function productobj(product, i){
  var self          = this;
  self.photo        = product.photos.medium_half
  self.title        = product.name
  self.tagline      = product.tagline
  self.url          = product.url
  self.description  = product.description
  self.htmlview     = ""
  self.index        = i
  self.custom_class = "col"+ ((i % 3) +1)

  self.updatehtml= function(){
    $.get('product-template.html', function(template){
      self.htmlview = template.
        replace('{image}', self.photo).
        replace('{title}', self.title).
        replace('{tagline}', self.tagline).
        replace('{description}', self.description).
        replace('{url}', self.url).
        replace('{custom_class}', self.custom_class);
    });
  }
}


var page=new domobj();
page.getproducts('data.json');
setTimeout("console.log('building html');page.updateproducthtml();",20);
setTimeout("page.updatedom()",50)

$(document).ready(function() {
  $('#content').on('click', '.dismiss', function(event) {
    event.preventDefault();
    $(this).closest('.product-container').fadeOut(300, function() {$this.remove()});
  })
});
