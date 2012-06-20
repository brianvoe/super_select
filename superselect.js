/*
  Advanced Select functionality plugin for jQuery
  Copyright (c) 2012 Brian Voelker (webiswhatido.com)
  Licensed under GPLv3
  http://www.opensource.org/licenses/gpl-3.0.html
  Version: 1
*/

(function($){

    /* Select Options */
    var select_options = {
        select_width: 150,
        info_width: 300
    };

    var select_data = {
        multiple: false,
        orig_id: '',
        supsel_id: '',
        values: []
    };

    var super_select_funcs = {
        create: function(options, input) {
            var info = this;

            /* Replace default options with requested options */
            info.options = $.extend({}, select_options, options);
            info.data = select_data;

            if ($(input).attr('id')) {
                info.data.orig_id = $(input).attr('id');
            } else {
                info.data.orig_id = Math.ceil(Math.random() * 100000);
                $(input).attr('id', info.data.orig_id);
            }
            info.data.values = [];
            $('#'+info.data.orig_id+' option:selected').each(function () {
                info.data.values.push(this.value);
            });
            info.data.multiple = ($('#'+info.data.orig_id).attr('multiple') ? true: false);
            info.data.supsel_id = info.data.orig_id+'_supsel';
            var new_select = '';
            new_select += '<div id="'+info.data.supsel_id+'" class="supsel_div">';
            new_select += '   <div class="supsel_select" style="width: '+info.options.select_width+'px;">Select option</div>';
            new_select += '   <div class="supsel_info" style="width: '+info.options.info_width+'px;">';
            new_select += '       <div class="supsel_search"><input type="text" value="" /></div>';
            new_select += '       <div class="supsel_results"><ul></ul></div>';
            new_select += '   </div>';
            new_select += '</div>';
            var new_results = '';

            /* Hide original select dropdown */
            //info.data.orig_select.hide();

            /* Create new dropdown */
            $(new_select).insertAfter($('#'+info.data.orig_id));

            /* Append values from original select and create array */
            $('#'+info.data.orig_id+' > option').each(function() {
                new_results += '<li data-value="'+this.value+'">'+this.text+'</li>';
            });
            $('#'+info.data.supsel_id+' .supsel_results ul').append(new_results);

            /* Add click events to results li */
            $('#'+info.data.supsel_id+' .supsel_results ul li').click({orig_id:info.data.orig_id}, function(info) {
                /* Set original select dropdown */
                $('#'+info.data.orig_id).val($(this).attr('data-value'));

                /* Highlight selcted li */
                $(this).parent().find('li').removeClass('supsel_on');
                $(this).addClass('supsel_on');
            });

            /* Select dropdown based upon dropdown value */
            $.each(info.data.values, function(index, value) {
                $('#'+info.data.supsel_id+' .supsel_results li[data-value="'+value+'"]').addClass('supsel_on');
            });

        },
        update_orig: function() {
        },
        destroy: function() {
            var info = $(this).data('superselect');

        /* Remove Super Drop */

        /* Destroy Data */
        }
    };

    $.fn.superselect = function(options) {
        return this.each(function() {
            /* Only allow select dropdown */
            if($(this).is('select')) {
                /* Method calling logic */
                if (super_select_funcs[options]) {
                    if($(this).data('superselect')) {
                        super_select_funcs[options].apply(this);
                    }
                } else if (typeof options === 'object' || !options) {
                    if(!$(this).data('superselect')){
                        var super_select_obj = Object.create(super_select_funcs);
                        super_select_obj.create(options, this);
                        $.data(this, 'superselect', super_select_obj);
                    }   
                } else {
                    $.error('Method ' +  options + ' does not exist in Super Select');
                }
            } else {
                $.error('Super Select can only be applied to select dropdowns.');
            }
        });
    };

})(jQuery);