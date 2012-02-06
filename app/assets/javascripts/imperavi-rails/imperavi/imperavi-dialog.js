// TODO: add custom events
// - onShow
// - onClose
// - onBuilt
// - onContentLoaded
// - onOkay
// - onCancel

(function( $ ) {
  $.fn.ImperaviDialog = function(o) {
    var o = $.extend({
      onOkay   : function()  { this.hide() },
      onCancel : function()  { this.hide() },
      onClose  : function(e) { this.close(e) },
      onBuilt  : function()  {},
      onLoad   : function()  {}
    }, o)

    this.initialize(o)
  }

  $.fn.ImperaviDialog.prototype = {
    el      : null,
    o       : null,
    overlay : null,

    initialize: function(o) {
      // Retrieve user options passed to imperavi
      this.o = $.extend($.fn.ImperaviOptions().options.dialog, o)
    },

    build: function() {
      // Build dialog just once
      if (this.el) return;

      // Create overlay
      this.overlay = new $.fn.ImperaviOverlay()

      // Dialog window
      this.el = $(document.createElement('div'))
        .attr('id', 'imperavi-dialog')
        .appendTo($('body'));

      // Close button
      this.closeBtn = $(document.createElement('a'))
        .attr('href', 'javascript:;')
        .html('&times;')
        .attr('id', 'imperavi-dialog-close')
        .appendTo(this.el);
      
      // Dialog title
      this.title = $(document.createElement('h1'))
        .attr('id', 'imperavi-dialog-title')
        .appendTo(this.el);

      // Dialog content
      this.article = $(document.createElement('article'))
        .attr('id', 'imperavi-dialog-content')
        .appendTo(this.el);

      // Buttons panel
      this.buttons = $(document.createElement('div'))
        .attr('id', 'imperavi-dialog-buttons')
        .appendTo(this.el);

      this.okay_button = this.addButton('Okay', 'okay')
        .click($.proxy(function(){ this.o.onOkay.call(this) }, this))

      this.cancel_button = this.addButton('Cancel', 'cancel')
        .click($.proxy(function(){ this.o.onCancel.call(this) }, this))

      // Set default size
      this.setSize(this.o.width, this.o.height)
      
      // Set default title
      this.setTitle(this.o.title)

      this.o.onBuilt.call(this)
    },

    addButton: function(caption, name) {
      return $(document.createElement('a'))
        .attr('id', 'imperavi-dialog-' + name)
        .attr('href', 'javascript:;')
        .html(caption)
        .appendTo(this.buttons);
    },

    addEvents: function() {
      var onCloseCallback = $.proxy(function(e){ this.o.onClose.call(this, e) }, this)

      $(document).keyup(function(e) { onCloseCallback(e) })
      this.closeBtn.click(function(e) { onCloseCallback(e) })
      this.overlay.el.click(function(e) { onCloseCallback(e) })
    },

    removeEvents: function() {
      $(document).unbind('keyup', $.proxy(this.close, this))
      this.closeBtn.unbind('click', $.proxy(this.close, this))
      this.overlay.el.unbind('click', $.proxy(this.close, this))
    },

    setSize: function(width, height) {
      this.el.css({
        width      : width+ 'px',
        height     : height + 'px',
        marginTop  : '-' + height / 2 + 'px',
        marginLeft : '-' + width / 2 + 'px'
      }).fadeIn('fast');    
    },

    setTitle: function(title) {
      this.title.html(title)
    },

    setContent: function(content) {
      this.article.html(content)
    },

    // TODO Load content via ajax
    loadContent: function(url) {
      this.setContent('')
      this.o.onLoad.call(this)
    },

    cleanUp: function() {
      this.removeEvents()
      this.setContent('')
      this.setTitle('')
    },

    show: function() {
      this.build()
      this.overlay.show()
      this.el.show()
      this.addEvents()
    },

    hide: function() {
      this.el.hide()
      this.overlay.hide()
      this.cleanUp()
    },

    close: function(e) {
      if (e.keyCode == 27 || e.type == 'click')
        this.hide()
    }
  }
})(jQuery);