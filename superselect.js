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
        blank_option: 'Choose option...',
        select_width: 300,
        info_width: 350,
        /* Ajax variables */
        ajax_url: '',
        ajax_data: {},
        ajax_search_name: 'superselect_search'
    };

    var select_data = {
        /* Status */
        multiple: false,
        is_shown: false,
        is_ajax: false,
        /* ids and select */
        orig_id: '',
        orig_select: null,
        supsel_id: '',
        supsel_select: null,
        /* Values */
        orig_values: {},
        search_values: {},
        values: []
    };

    var super_select_funcs = {
        create: function(options, input) {
            var info = this;

            /* Replace default options with requested options */
            info.options = $.extend({}, select_options, options);
            info.data = $.extend({}, select_data, {});

            /* Reset array values */
            info.data.orig_values = {};
            info.data.search_values = {};
            info.data.values = [];
            
            /* Set global variables */
            if ($(input).attr('id')) {
                info.data.orig_id = $(input).attr('id');
            } else {
                info.data.orig_id = Math.ceil(Math.random() * 100000);
                $(input).attr('id', info.data.orig_id);
            }
            
            $('#'+info.data.orig_id+' option:selected').each(function() {
                info.data.values.push(this.value);
            });
            info.data.multiple = ($('#'+info.data.orig_id).attr('multiple') ? true: false);
            info.data.supsel_id = info.data.orig_id+'_supsel';

            /* Create html for supsel */
            var new_select = '';
            new_select += '<div id="'+info.data.supsel_id+'" class="supsel_div">';
            new_select += '   <div class="supsel_select supsel_topoff" tabindex="0" style="width: '+info.options.select_width+'px;">';
            new_select += '       <div class="supsel_select_values">Select option</div>';
            new_select += '       <div class="'+(info.data.multiple ? 'supsel_select_add': 'supsel_select_arrow supsel_arrow_down')+'"></div>';
            new_select += '       <div class="supsel_clear"></div>';
            new_select += '   </div>';
            new_select += '   <div class="supsel_info" style="width: '+info.options.info_width+'px;">';
            new_select += '       <div class="supsel_search"><input placeholder="Search..." type="text" value="" /></div>';
            new_select += '       <div class="supsel_results">';
            new_select += '           <div class="supsel_noresults">No Results Found</div>';
            new_select += '           <div class="supsel_results_list"><ul></ul></div>';
            new_select += '       </div>';
            new_select += '   </div>';
            new_select += '</div>';
            var new_results = '';

            /* Set inputs into variables */
            info.data.orig_select = $('#'+info.data.orig_id);
            info.data.supsel_select = $(new_select);

            /* Set items from original select */
            info.data.orig_select.attr('tabindex', '-1');
            info.options.blank_option = (info.data.orig_select.data('placeholder') ? info.data.orig_select.data('placeholder'): info.options.blank_option);
            info.data.is_ajax = (info.options.ajax_url != '' ? true: false);

            /* Hide original select dropdown */
            info.data.orig_select.hide();

            /* Create new dropdown */
            info.data.supsel_select.insertAfter(info.data.orig_select);

            /* Append values from original select and create array */
            info.data.orig_select.find(' > option').each(function() {
                new_results += '<li data-value="'+this.value+'">'+this.text+'</li>';
                info.data.orig_values[this.value] = this.text;
            });
            info.data.supsel_select.find('.supsel_results ul').append(new_results);

            /* Add click to supsel_select */
            info.data.supsel_select.find('.supsel_select').click(function(){
                if(info.data.is_shown){
                    info.hide_results();
                } else {
                    info.show_results();
                }
            });

            /* Add tab focus to supsel_select */
            // info.data.supsel_select.find('.supsel_select').focusin(function(){
            //     if(!info.data.is_shown){
            //         info.show_results();
            //     }
            // });

            /* Detect if click outside of supsel */
            $(document).click(function(event) {
                if($(event.target).parents().index(info.data.supsel_select) == -1) {
                    if(info.data.is_shown) {
                        info.hide_results();
                        info.search_clear();
                        info.set_display_values();
                    }
                }
            });

            /* Add click events to results li */
            if(!info.data.is_ajax){
                info.data.supsel_select.find('.supsel_results ul li').click(function() {
                    if(info.data.multiple){
                        /* Push multiple values */
                        info.data.values.push($(this).attr('data-value'));
                    } else {
                        /* Set single value */
                        info.data.values = [$(this).attr('data-value')];
                    }

                    info.hide_results();
                    info.set_select_values();
                    info.set_display_values();
                });
            }

            /* Add key event to search input */
            info.data.supsel_select.find('.supsel_search input').keyup(function(){
                info.search(this.value);
            });

            /* Select dropdown based upon dropdown value */
            info.set_display_values();

        },
        set_values: function(values) {
            var info = $(this).data('superselect');

            info.data.values = [];
            if($.isArray(values)) {
                $.each(values, function(index, value) {
                    /* Check to ensure values exist */
                    if(info.data.orig_select.find('option[value="'+value+'"]').length > 0){
                        if(info.data.multiple) {
                            info.data.values.push(value);
                        } else {
                            info.data.values = [value];
                        }
                    }
                });
            } else {
                if(info.data.orig_select.find('option[value="'+values+'"]').length > 0){
                    info.data.values = [values];
                }
            }

            info.set_select_values();
            info.set_display_values();
        },
        set_select_values: function() {
            var info = this;

            info.data.orig_select.val(info.data.values);
        },
        set_display_blank: function() {
            var info = this;

            info.data.supsel_select.find('.supsel_select .supsel_select_values').html('<span class="show_blank">'+info.options.blank_option+'</span>');
        },
        set_display_values: function() {
            var info = this;

            if(info.data.values.length === 0 || info.data.values[0] == ''){
                info.set_display_blank();
            } else {
                if(info.data.multiple) {
                    var multi_values = '';

                    /* Set supsel_select_values value */
                    $.each(info.data.values, function(index, value) {
                        multi_values += '<div data-value="'+value+'" class="supsel_select_item">';
                        multi_values += '   <div class="supsel_select_item_text">'+info.data.orig_select.find('option[value="'+value+'"]').text()+'</div>';
                        multi_values += '   <div class="supsel_select_item_del"></div>';
                        multi_values += '</div>';
                    });
                    info.data.supsel_select.find('.supsel_select .supsel_select_values').html(multi_values);

                    /* Add click event to items */
                    info.data.supsel_select.find('.supsel_select .supsel_select_item_del').click(function(){
                        /* Remove value from array */
                        info.data.values.splice($.inArray($(this).parent().attr('data-value'), info.data.values), 1);

                        /* Set values and reset display */
                        info.set_select_values();
                        info.set_display_values();
                    });

                    /* Hide multiple selected values */
                    info.data.supsel_select.find('.supsel_info li').removeClass('supsel_show supsel_on supsel_hide');
                    $.each(info.data.values, function(index, value) {
                        info.data.supsel_select.find('.supsel_results li[data-value="'+value+'"]').addClass('supsel_hide');
                    });
                } else {
                    /* Set supsel_select_values value */
                    info.data.supsel_select.find('.supsel_select .supsel_select_values').html(info.data.orig_select.find('option[value="'+info.data.values[0]+'"]').text());

                    /* Set style for selected single value */
                    info.data.supsel_select.find('.supsel_info li').removeClass('supsel_show supsel_on supsel_hide');
                    $.each(info.data.values, function(index, value) {
                        info.data.supsel_select.find('.supsel_results li[data-value="'+value+'"]').addClass('supsel_on');
                    });
                }
            }
        },
        show_results: function() {
            var info = this;

            info.data.supsel_select.find('.supsel_info').show();
            /* Focus on search box */
            info.data.supsel_select.find('.supsel_search input').focus();
            /* Change z-index */
            info.data.supsel_select.find('.supsel_select').css('z-index', 100);
            info.data.supsel_select.find('.supsel_info').css('z-index', 99);
            /* Change select style */
            info.data.supsel_select.find('.supsel_topoff').removeClass('supsel_topoff').addClass('supsel_topon');
            /* Change arrow image */
            info.data.supsel_select.find('.supsel_arrow_down').removeClass('supsel_arrow_down').addClass('supsel_arrow_up');

            info.data.is_shown = true;
        },
        hide_results: function() {
            var info = this;

            info.data.supsel_select.find('.supsel_info').hide();
            /* Change z-index */
            info.data.supsel_select.find('.supsel_select').css('z-index', 2);
            info.data.supsel_select.find('.supsel_info').css('z-index', 1);
            /* Change select style */
            info.data.supsel_select.find('.supsel_topon').removeClass('supsel_topon').addClass('supsel_topoff');
            /* Change arrow image */
            info.data.supsel_select.find('.supsel_arrow_up').removeClass('supsel_arrow_up').addClass('supsel_arrow_down');

            info.data.is_shown = false;
        },
        search: function(input_value) {
            var info = this;

            info.data.search_values = [];

            if(input_value != '') {
                if(info.data.is_ajax) {
                    /* Ajax Search requested location */
                    var search_name = {};
                    search_name[info.options.ajax_search_name] = input_value;
                    $.ajax({
                        url: info.options.ajax_url,
                        type: 'POST',
                        dataType: 'json',
                        data: $.extend({}, info.options.ajax_data, search_name),
                        success: function(data){
                            info._process_ajax_data(data);
                        }
                    });
                } else {
                    /* Take input_value and search array */
                    info.data.search_values = $.map(this.data.orig_values, function(value, key) {
                        var search = new RegExp(input_value, 'gi');
                        if(value.match(search)) {
                            return key;
                        } else {
                            return null;
                        }
                    });

                    info.search_hide_display_values();
                }
            } else {
                info.search_clear();
                info.set_display_values();
                info.search_show_display_values();
            }
        },
        _process_ajax_data: function(data) {
            var info = this;
            var results_li = '';

            // Take data from results and add to to display
            info.data.supsel_select.find('.supsel_results ul').html('');
            $.each(data, function(key, value) {
                results_li += '<li data-value="'+key+'">'+value+'</li>';
            });
            info.data.supsel_select.find('.supsel_results ul').append(results_li);

            // Add click event to newly added li
            info.data.supsel_select.find('.supsel_results ul li').click(function() {
                if(info.data.multiple){
                    /* Push multiple values */
                    info.data.values.push($(this).attr('data-value'));
                } else {
                    /* Set single value */
                    info.data.values = [$(this).attr('data-value')];

                    var value = $(this).attr('data-value');
                    var text = $(this).html();

                    /* Hide results */
                    info.hide_results();

                    /* Set display select */
                    info.data.supsel_select.find('.supsel_select .supsel_select_values').html(text);

                    /* Set original select */
                    info.data.orig_select.html('');
                    info.data.orig_select.html('<option value="'+value+'">'+text+'</option>');

                    /* Set original value */
                    info.data.orig_select.val(value);
                }
            });
        },
        search_clear: function() {
            var info = this;

            /* Clear search input */
            info.data.supsel_select.find('.supsel_search input').val('');

            /* Hide supsel_noresults */
            info.data.supsel_select.find('.supsel_results .supsel_noresults').hide();

            /* Remove class supsel_show_except supsel_show supsel_on */
            info.data.supsel_select.find('.supsel_results').removeClass('supsel_show_except');
            info.data.supsel_select.find('.supsel_results li').removeClass('supsel_show supsel_on');
        },
        search_hide_display_values: function() {
            var info = this;

            /* Remove class supsel_show supsel_on */
            info.data.supsel_select.find('.supsel_results li').removeClass('supsel_show supsel_on');

            /* Add class to results */
            info.data.supsel_select.find('.supsel_results').addClass('supsel_show_except');

            /* Add class supsel_show */
            $.each(info.data.search_values, function(index, value) {
                info.data.supsel_select.find('.supsel_results li[data-value="'+value+'"]:not(.supsel_hide)').addClass('supsel_show');
            });

            /* If no results show supsel_noresults */
            if(info.data.supsel_select.find('.supsel_results li:visible').length > 0){
                info.data.supsel_select.find('.supsel_results .supsel_noresults').hide();
            } else {
                info.data.supsel_select.find('.supsel_results .supsel_noresults').show();
            }
        },
        search_show_display_values: function() {
            var info = this;

            /* Remove class to results */
            info.data.supsel_select.find('.search_results').removeClass('supsel_show_except');

            /* Remove class supsel_show */
            info.data.supsel_select.find('.search_results li').removeClass('supsel_show');

            info.set_display_values();
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
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            /* Only allow select dropdown */
            if($(this).is('select')) {
                /* Method calling logic */
                if (super_select_funcs[options]) {
                    if($(this).data('superselect')) {
                        super_select_funcs[options].apply(this, args);
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