fields =['timestamp', 'host','time_taken_millis', 'write_time','read_time','php_version', 'payload']

$(document).ready(function(){
    //theme the table:
    //$("table thead").addClass("ui-widget-header");
    //$("table body").addClass("ui-widget-content");
    //fill the table
    //alert(newrow);
    /*data = new Array(5);
    data['time'] = '10:00:00';
    data['provider'] = 'Openshift';
    data['language'] = 'php 5.2';
    data['platform'] = 'nginx';
    data['req_per_sec'] = '1.23';*/
        /*addNewRow({
            'id':'1',
            'time':'10:00:00',
            'provider':'Google',
            'language':'php 5.3',
            'platform':'nginx',
            'req_per_sec':'1.56',
            
            });

            //Remove ui classes from footer links:
            $( ".footer a, .footer a span" ).removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-text');
            //$( ".footer a").setAttr('role','');
            //$( ".footer > :last").after('<a href="http://www.prahladyeri.com">Prahlad Yeri</a>');
            $('.footer .info').append('This app is under active development. Feel free to send any suggestions or hosting recommendations through our <a href="http://www.facebook.com/hostmetric">facebook</a> page.');
            console.log('done');*/

            //$( ".footer > :last").after('<a href="http://www.prahladyeri.com">Prahlad Yeri</a>');
            $('.footer .info').append('**All timings are in milliseconds, unless specified otherwise. ');
            $('.footer .info').append('**read_time refers to read the {payload} from disk or database for {iterations} number of times. ');
            $('.footer .info').append('**write_time refers to write the {payload} to disk or database for {iterations} number of times. ');
            $('.footer .info').append('**generation_time refers to time taken to generate the {payload}.<br>');
            $('.footer .info').append('This app is under active development. Feel free to send any suggestions or hosting recommendations through the <a href="http://www.facebook.com/hostmetric">Facebook</a> page.<br>');
            $('.footer .info').append('Source code for this app is free and MIT Licensed. Check out my <a href="https://github.com/prahladyeri/benchthemall">github</a> repo.');
            
            ajaxRefresh();
            
});

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

function ajaxRefresh()
{
    config = {
        url: 'json_refresh',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function(ls) {
            //addNewRow(object);
            //alert(JSON.stringify(ls));
            resetTable();
                for (i in ls)
                //for (i=0;i<ls.length;i++) //TODO: Revisit here and check why this for-i loop is not working, but for-in loop is working.
                {
                    //alert('iter once');
                    //alert( JSON.stringify(ls[i]));
                    addNewRow(ls[i]);
                    //addNewRow(ls[i],(i==1?true:false));
                }
            },
        failure: function(xhr, status, errorThrown) {alert("Error occured.");},
        complete: function() {
            //alert('complete');
            }
        }
        
        $.ajax(config);
}

function ajaxShowDetails(id)
{
    config = {
        url: "json_show_details?id=" + id,
        data: {},
        type: "GET",
        dataType: "json",
        success: function (json){
            alert(json);
            },
        error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        },
         complete: function( xhr, status ) {
                alert( "The request is complete!" );
            }     
        };
    
    $.ajax(config);
}

function ajaxDoTest(providers)
{
    config = {
        url: "json_do_test",
        type: "GET",
        data: {'data':providers},
        dataType: "json",
        success: function (json){
            dialogShowResult(json);
            addNewRow(json, true);
            /*for(key in json)
            {
                r = json[key];
                for (kkey in r)
                {
                    alert(kkey + ':' + r[kkey]);
                }
            }*/
            },
        error: function( xhr, status, errorThrown ) {
            //alert( "Sorry, there was a problem!" );
            alert( "Error: " + errorThrown + "::Status: " + status);
            //alert( "Status: " + status );
            //console.dir( xhr );
        },
         complete: function( xhr, status ) {
                //alert( "The request is complete!" );
            }     
        };
    
    $.ajax(config);
}

function resetTable()
{
    //empty table
    $("#results > thead").empty();
    $("#results > tbody").empty();
    //add header
    newrow = '<tr>';
    for (i=0;i<fields.length;i++){
        newrow+=    '<th>' + fields[i] + '</th>'
        }
    newrow+='</tr>';
    $("#results > thead").append(newrow);
}
    
function addNewRow(data,  before=false)
{
    //create new row
    //create html for the new row
    newrow = '<tr>';
    //for (key in data)
    for (i=0;i<fields.length;i++)
        newrow+=    '<td>' + data[fields[i]] + '</td>'
    newrow+='</tr>';
    if (before)
        $("#results > tbody:last").prepend(newrow);
    else
        $("#results > tbody:last").append(newrow);
        
    //alert('called me');

    /*'<td>' + data['time'] + '</td>' +
    '<td>' + data['provider'] + '</td>' +
    '<td>' + data['language'] + '</td>' +
    '<td>' + data['platform'] + '</td>' +
    '<td>' + data['req_per_sec'] + '</td>' +
    "<td><a href='#' onclick=\"ajaxShowDetails('" + data['id'] + "');\">Click</a></td>";*/
    
    //$("#results tr:last").after(newrow);
    
    //remove these css classes from <a>: ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only
    //ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only
    /*$("#results a").each(function() {
        //alert( $(this).attr('href'));
        //alert ($(this).hasClass('ui-button'));
        
        $(this).removeClass('ui-button');
        $(this).removeClass('ui-widget');
        $(this).removeClass('ui-state-default');
        $(this).removeClass('ui-corner-all');
        $(this).removeClass('ui-button-text-only');
        
    });*/
}

//-----DIALOGS------
//$(function() {
dialogDoTest = function() {
$( "#dlgDoTest" ).dialog({
    resizable: false,
    //height:500,
    width: 400,
    modal: true,
    buttons: {
    "Test Now": function() {
        //alert( $("#lstProvider").val() 
        provider = $("#lstProvider").val() ;
        if (provider=='') {alert('Please select a provider.');return;}
        
        //provider="weird";
        //alert(typeof(provider));
        ajaxDoTest(provider);
         $( this ).dialog( "close" );
        },
    "Cancel": function() {
    $( this ).dialog( "close" );
    }
    }
    });
};
$( "#dlgDoTest" ).hide();


dialogShowResult = function(result) {
    $("#divResult").empty();
    for (i=0;i<fields.length;i++)
    {
        newrow+=    '<td>' + result[fields[i]] + '</td>'
        $("#divResult").append('<label>' + fields[i] + ': ' + result[fields[i]] +  '</label><br>')
    }

    //~ for (key in result) {
        //~ if (typeof(result[key]) === String )
        //~ {
            //~ //alert('string'+result[key]);
            //~ 
        //~ }
        //~ else
        //~ {
            //alert('object'+result[key]);
            //~ object = result[key];
            //~ for (kkey in object)
            //~ {
                //~ $("#divResult").append('<label>' + kkey + ': ' + object[kkey] +  '</label><br>')
            //~ }
        //~ }
    //~ }
    //if (result['req_per_sec']) $("#divResult").append('req_per_sec:' + result['req_per_sec']);

    $( "#dlgShowResult" ).dialog({
        resizable: false,
        //width:700,
        modal: true,
        buttons: {
        "OK": function() {
                $( this ).dialog( "close" );
            }
        }
        });
};
$( "#dlgShowResult" ).hide();


/*$().ready(function(){
 $(".jtable th").each(function(){
 
  $(this).addClass("ui-state-default");
 
  });
 $(".jtable td").each(function(){
 
  $(this).addClass("ui-widget-content");
 
  });
 $(".jtable tr").hover(
     function()
     {
      $(this).children("td").addClass("ui-state-hover");
     },
     function()
     {
      $(this).children("td").removeClass("ui-state-hover");
     }
    );
 $(".jtable tr").click(function(){
   
   $(this).children("td").toggleClass("ui-state-highlight");
  });
 
}); 
*/


