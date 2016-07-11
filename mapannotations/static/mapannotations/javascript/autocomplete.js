//   Copyright (C) 2016 University of Dundee & Open Microscopy Environment.
//   All rights reserved.

//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU Affero General Public License as
//   published by the Free Software Foundation, either version 3 of the
//   License, or (at your option) any later version.

//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU Affero General Public License for more details.

//   You should have received a copy of the GNU Affero General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>.

//   Author: Aleksandra Tarkowska <A(dot)Tarkowska(at)dundee(dot)ac(dot)uk>,

//   Version: 1.0

//   Here we override ui.autocomplete


$(function () {

    var oldData = $.jstree.reference('#dataTree').settings.core.data;
    var jstreeInst = $.jstree.reference('#dataTree');
    $("#mapannotation").autocomplete({
        autoFocus: true,
        source: function( request, response ) {
            $.ajax({
                dataType: "json",
                type : 'GET',
                url: MAPANNOTATIONS.URLS.autocomplete,
                data: {
                    query: request.term,
                    experimenter_id: WEBCLIENT.active_user,
                    group: WEBCLIENT.active_group_id
                },
                success: function(data) {
                    $('#autocomplete').removeClass('ui-autocomplete-loading');  
                    response( $.map( data, function(item) {
                        return item;
                    }));
                },
                error: function(data) {
                    $('#mapannotation').removeClass('ui-autocomplete-loading');  
                }
            });
        },
        minLength: 1,
        open: function() {},
        close: function() {},
        focus: function(event,ui) {
            $( "#mapannotation" ).val( ui.item.label );
            return false;
        },
        select: function(event, ui) {
            WEBCLIENT.URLS.api_experimenters = MAPANNOTATIONS.URLS.autocomplete_default
            $.jstree.reference('#dataTree').settings.core.data = function(node, callback, payload) {
                oldData.apply(jstreeInst, [node, callback, {'query': ui.item.value}]);
            };
            $.jstree.reference('#dataTree').refresh();
            return false;
        }
    }).data("ui-autocomplete")._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<a>" + item.label + "</a>" )
            .appendTo( ul );
    }

    //$("#mapannotation").val('KIF')
    //    .data("ui-autocomplete")
    //    ._trigger('select', 'autocompleteselect', {
    //        item: {
    //            label: MAPANNOTATIONS.MENU.label,
    //            value: MAPANNOTATIONS.VALUE}} );
    
});