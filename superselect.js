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
        
    };

    var super_select_funcs = {
        create: function(options, input) {
            /* Set variables */
            var info = this;
            var orig_select = $(input);
            var orig_id = '';
            if (orig_select.attr('id')) {
                orig_id = orig_select.attr('id');
            } else {
                orig_id = Math.ceil(Math.random() * 100000);
                orig_select.attr('id', orig_id);
            }
            var new_id = orig_id+'_supsel';
            var new_li_num = 0;
            var new_select = '';
            new_select += '<div id="'+new_id+'_div'+'" class="supsel_div">';
            new_select += '   <div class="supsel_select"></div>';
            new_select += '   <div class="supsel_info">';
            new_select += '       <div class="supsel_search"></div>';
            new_select += '       <div class="supsel_results"><ul></ul></div>';
            new_select += '   </div>';
            new_select += '</div>';
            var new_array = new Array();
            var new_results = '';

            /* Replace default options with requested options */
            info.options = $.extend({}, select_options, options);

            /* Hide select dropdown */
            //orig_select.hide();

            /* Create new dropdown */
            $(new_select).insertAfter(orig_select);

            /* Append values from original select and create array */
            $('#'+orig_id+' > option').each(function() {
                new_results += '<li id="'+new_id+'_'+new_li_num+'">'+this.text+'</li>';
                new_array[new_id+'_'+new_li_num] = this.value;
                new_li_num++;
            });
            $('#'+new_id+'_div .supsel_results ul').append(new_results);

            /* Add click events to results li */
            $('#'+new_id+'_div .supsel_results ul li').click(function() {
                /* Set original select dropdown */
                $('#'+orig_id).val(new_array[$(this).attr('id')]);
            });

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