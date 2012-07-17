Super Select
============

Super Select is an advanced dropdown plugin that takes a normal select dropdown and turns it into a searchable, customizable option selector.

## Example:

```javascript

$(document).ready(function(){
	$('.super_select').superselect({
        blank_option: 'Choose option...', /* Default placeholder */
        select_width: 300, /* Select width */
        info_width: 350, /* Display options width */
        /* Ajax variables */
        ajax_url: '', /* Url location for passing post data to, in order to return json info */
        ajax_data: {}, /* Pass additional varables along with post */
        ajax_search_name: 'superselect_search', /* Post name of search value */
        ajax_orig_results: false /* Allow original results from created dropdown to show in addition to search results. */
    });
});

```
