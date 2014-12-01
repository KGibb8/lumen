$(function () {

  function wysify() {
    $('textarea.wysiwyg').not('textarea.wysified').each(function () {
      var textarea = this;
      var summernote = $('<div class="summernote"></div>');
      $(summernote).insertAfter(this);
      $(summernote).summernote({
        toolbar: [
          ['view', ['codeview', 'fullscreen']],
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video']],
        ],
        height: 200
      });
      $(summernote).code($(textarea).val());
      $(textarea).addClass('wysified').hide();
      $(textarea.form).submit(function () {
        $(textarea).val($(summernote).code());
      });
    });
  }

  function containedPagination() {
    $('.pagination a').click(function (e) {
      if ($(this).attr('href') != '#') {
        $(this).closest('.page-container').load($(this).attr('href'), function () {
          scroll(0, 0);
        });
      }
      return false;
    });
  }

  $(document).ajaxComplete(function () {
    wysify();
    containedPagination();
  });
  wysify();

  $(window).resize(function () {
    if (document.documentElement.clientWidth < 992) {
      $('.tabs-left-please').removeClass('tabs-left');
    } else {
      $('.tabs-left-please').addClass('tabs-left');
    }
  });
  $(window).resize();

  $('form').submit(function () {
    $('button[type=submit]', this).attr('disabled', 'disabled').html('Submitting...');
  });

  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    $('.fc-event').popover('destroy');
  });

  Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
      if (unique.indexOf(this[i]) == -1) {
        unique.push(this[i]);
      }
    }
    return unique;
  };

  $(document).on('click', 'a[data-confirm]', function (e) {
    var message = $(this).data('confirm');
    if (!confirm(message)) {
      e.preventDefault();
      e.stopped = true;
    }
  });

  $('.geopicker').geopicker({
    width: '100%',
    getLatLng: function (container) {
      var lat = $('input[name$="[lat]"]', container).val()
      var lng = $('input[name$="[lng]"]', container).val()
      if (lat.length && lng.length)
        return new google.maps.LatLng(lat, lng)
    },
    set: function (container, latLng) {
      $('input[name$="[lat]"]', container).val(latLng.lat());
      $('input[name$="[lng]"]', container).val(latLng.lng());
    }
  });

  $(document).on('click', 'a.popup', function (e) {
    window.open(this.href, null, 'scrollbars=yes,width=600,height=600,left=150,top=150').focus();
    return false;
  });

  $('#results-form').submit(function (e) {
    e.preventDefault();
    $('#filter-spin').show();
    $('#results').load($(this).attr('action') + '?' + $(this).serialize(), function () {
      $('#filter-spin').hide();
    });
  });

  $('#results-form input[type=radio]').change(function () {
    $(this.form).submit();
  });

  $('#results-form').submit();

  $('a.modal-trigger').click(function () {
    $('#modal .modal-content').load(this.href, function () {
      $('#modal').modal('show');
    });
    return false;
  });

});
