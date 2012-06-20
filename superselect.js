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
        orig_select: null,
        supsel_id: '',
        supsel_select: null,
        values: []
    };

    var super_select_funcs = {
        create: function(options, input) {
            var info = this;

            /* Replace default options with requested options */
            info.options = $.extend({}, select_options, options);
            info.data = $.extend({}, select_data, {});

            /* Set global variables */
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

            /* Create html for supsel */
            var new_select = '';
            new_select += '<div id="'+info.data.supsel_id+'" class="supsel_div">';
            new_select += '   <div class="supsel_select supsel_topoff" style="width: '+info.options.select_width+'px;">';
            new_select += '     <span>Select option</span>';
            new_select += '     <div class="supsel_arrow_down"></div>';
            new_select += '   </div>';
            new_select += '   <div class="supsel_info" style="width: '+info.options.info_width+'px;">';
            new_select += '       <div class="supsel_search"><input type="text" value="" /></div>';
            new_select += '       <div class="supsel_results"><ul></ul></div>';
            new_select += '   </div>';
            new_select += '</div>';
            var new_results = '';

            /* Set inputs into variables */
            info.data.orig_select = $('#'+info.data.orig_id);
            info.data.supsel_select = $(new_select);

            /* Hide original select dropdown */
            //info.data.orig_select.hide();

            /* Create new dropdown */
            info.data.supsel_select.insertAfter(info.data.orig_select);

            /* Append values from original select and create array */
            info.data.orig_select.find(' > option').each(function() {
                new_results += '<li data-value="'+this.value+'">'+this.text+'</li>';
            });
            info.data.supsel_select.find('.supsel_results ul').append(new_results);

            /* Add click to supsel_select */
            info.data.supsel_select.find('.supsel_select').toggle(function(){
                info.show_results();
            },function(){
                info.hide_results();
            });

            /* Add click events to results li */
            info.data.supsel_select.find('.supsel_results ul li').click(function() {
                if(info.data.multiple){
                    /* Push multiple values */
                    info.data.values.push($(this).attr('data-value'));
                } else {
                    /* Set single value */
                    info.data.values = [$(this).attr('data-value')];
                }

                info.set_select_values();
                info.set_display_values();
            });

            /* Select dropdown based upon dropdown value */
            info.set_display_values();


        },
        set_values: function(values) {
            var info = this;

            if($.isArray(values)) {
                info.data.values = [];
                $.each(values, function(index, value) {
                    info.data.values.push(value);
                });
            } else {
                info.data.values = [values];
            }

            info.set_select_values();
            info.set_display_values();
        },
        set_select_values: function() {
            var info = this;

            if(info.data.multiple) {
                info.data.orig_select.val(info.data.values);
            } else {
                info.data.orig_select.val(info.data.values);
            }
        },
        set_display_values: function() {
            var info = this;

            if(info.data.multiple) {
                /* Hide multiple selected values */
                info.data.supsel_select.find('.supsel_info li').removeClass('supsel_on supsel_hide');
                $.each(info.data.values, function(index, value) {
                    info.data.supsel_select.find('.supsel_results li[data-value="'+value+'"]').addClass('supsel_hide');
                });
            } else {
                /* Set style for selected single value */
                info.data.supsel_select.find('.supsel_info li').removeClass('supsel_on supsel_hide');
                $.each(info.data.values, function(index, value) {
                    info.data.supsel_select.find('.supsel_results li[data-value="'+value+'"]').addClass('supsel_on');
                });
            }
        },
        show_results: function() {
            var info = this;

            info.data.supsel_select.find('.supsel_info').show();
            /* Change select style */
            info.data.supsel_select.find('.supsel_topoff').removeClass('supsel_topoff').addClass('supsel_topon');
            /* Change arrow image */
            info.data.supsel_select.find('.supsel_arrow_down').removeClass('supsel_arrow_down').addClass('supsel_arrow_up');
        },
        hide_results: function() {
            var info = this;

            info.data.supsel_select.find('.supsel_info').hide();
            /* Change select style */
            info.data.supsel_select.find('.supsel_topon').removeClass('supsel_topon').addClass('supsel_topoff');
            /* Change arrow image */
            info.data.supsel_select.find('.supsel_arrow_up').removeClass('supsel_arrow_up').addClass('supsel_arrow_down');
        },
        destroy: function() {
            var info = $(this).data('superselect');

            /* Remove Super Drop */
            info.data.supsel_select.remove();

            /* Show original select */
            info.data.orig_select.show();

            /* Destroy Data */
            $.removeData(this, 'superselect');
        }
    };

    $.fn.superselect = function(options) {
        //console.log(parameters);
        return this.each(function() {
            /* Only allow select dropdown */
            if($(this).is('select')) {
                /* Method calling logic */
                if (super_select_funcs[options]) {
                    if($(this).data('superselect')) {
                        super_select_funcs[options].apply(this, Array.prototype.slice.call(arguments, 1));
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