
function Page(){
  var self = this;
  self.products   = null;
  self.productTemplate = null;
  self.rendered = false;

  self.init = function(url) {
    self.getproducts(url);
    self.getTemplate();
  }

  self.isLoaded = function(url) {
    return self.products && self.productTemplate ? true: false;
  }

  self.getproducts = function(url){
    self.products = []
    $.getJSON(url, function(response){
        for(i=0; i<response.sales.length ; i++){
          self.products.push( new Product(response.sales[i], i)  );
        }
    });
  }

  self.getTemplate = function(url) {
    $.get('product-template.html', function(template){
      self.productTemplate = template
    });
  }

  self.updateDOM = function(){
    var i=0
    thishtml='';
    for( i=0; i< self.products.length ; i++){
      thishtml += self.products[i].toHTML(self.productTemplate);
    }
    $("#content").append(thishtml)
    self.hideLoading();
  }

  self.render = function(){
    console.log("page.isLoaded(), loaded?" + page.isLoaded());
    if (page.isLoaded() && !page.rendered) {
      page.updateDOM();
      page.rendered = true;
    }
  }

  self.hideLoading = function() {
    $('.loading').remove();
  }
}

function Product(product, i, template){
  var self          = this;
  self.photo        = product.photos.medium_half
  self.title        = product.name
  self.tagline      = product.tagline
  self.url          = product.url
  self.index        = i
  self.description = product.description

  self.toHTML= function(template){
    return template.
      replace('{image}', self.photo).
      replace('{title}', self.title).
      replace('{tagline}', self.tagline).
      replace('{description}', self.description).
      replace('{url}', self.url).
      replace('{custom_class}', self.custom_class);
  }
}

page=new Page();

$(document).ajaxComplete(function() {
  page.render();
});
setTimeout("page.render()",50)

page.init('data.json');

$(document).ready(function() {
  $('#content').on('click', '.dismiss', function(event) {
    event.preventDefault();
    $(this).closest('.product-container').remove();
  })
});
