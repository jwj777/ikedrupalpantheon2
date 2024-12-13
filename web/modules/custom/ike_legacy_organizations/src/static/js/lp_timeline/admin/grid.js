(function($) {
  var checkOrder, getGridOrder, initOrder;
  initOrder = null;
  getGridOrder = function() {
    var order;
    order = [];
    $('.grid-wrapper > div').each(function() {
      return order.push($(this).data('id'));
    });
    return order;
  };
  checkOrder = function() {
    var i, newOrder;
    newOrder = getGridOrder();
    i = 0;
    while (i < initOrder.length) {
      if (newOrder[i] !== initOrder[i]) {
        console.log(newOrder[i], ' IS NOW ', i);
      }
      i++;
    }
    return initOrder = newOrder;
  };
  initOrder = getGridOrder();
  $('.grid-wrapper').sortable({
    revert: true,
    update: checkOrder
  });
  return $('[data-role=tooltip]').tooltip({
    html: true,
    placement: 'bottom'
  });
})(jQuery);
