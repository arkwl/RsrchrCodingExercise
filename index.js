$(document).ready(function() {
  $('.popover-markup>.trigger').popover({
    html: true,
    title: function() {
      return $(this).parent().find('.head').html();
    },
    content: function() {
      return $(this).parent().find('.content').html();
    }
  });

  $(function() {
    //add a handler to all a.trigger elements:
    $('body').on("click", ".dropdown-menu > li > a.trigger", function(e) {

      var current = $(this).next();
      var grandparent = $(this).parent().parent();

      if ($(this).hasClass('left-caret') || $(this).hasClass('right-caret'))
        $(this).toggleClass('right-caret left-caret');

      //find siblings (children of our grandparent that have a left caret and aren't me)  
      grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
      grandparent.find(".sub-menu:visible").not(current).hide();
      //turn off their carets, close their submenus

      //turn on my submenu
      current.toggle();
      e.stopPropagation();
    });

    //add a handle to all elements that arent submenu triggers
    $(".dropdown-menu > li > a:not(.trigger)").on("click", function() {
      //hide other all submenus in my dropdown
      var root = $(this).closest('.dropdown');
      root.find('.left-caret').toggleClass('right-caret left-caret');
      root.find('.sub-menu:visible').hide();
    });
  });
});
