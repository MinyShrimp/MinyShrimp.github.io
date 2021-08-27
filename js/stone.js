const id_to_index = { 'btn1': 0, 'btn2': 1, 'btn3': 2 };
const changed_values = 10;
let successes   = [ 0, 0, 0 ];
let counts      = [ 0, 0, 0 ];
let indexs      = [ 0, 0, 0 ];
let pct         = 75;
let total_count = 0;

function init() {
    successes = [ 0, 0, 0 ];
    counts    = [ 0, 0, 0 ];
    indexs    = [ 0, 0, 0 ];
    pct       = 75;
    total_count++;

    $('input').toArray().forEach( element => {
        $(element).prop( 'checked',  false );
        $(element).prop( 'disabled', false );
    });
    $('#pct').text(pct + '%');
    $('.successes').toArray().forEach( element => {
        $(element).text('+0 / 10');
    });
    $('#count').text(total_count + '개');
}

function getRandom() {
    return Math.floor(Math.random() * 1000);
}

function isTrue() {
    let _random = getRandom();
    return _random < ( pct * 10 );
}

function pct_changed( _value ) {
    pct += _value;
    if( pct < 25 ) { pct = 25; }
    if( pct > 75 ) { pct = 75; }
    $('#pct').text(pct + '%');
}

function open_modal() {
    $('.total').toArray().forEach( (element, index) => {
        $(element).text( '+' + successes[index] + ' / 10' );
    });
    $('#myModal').css('display', 'block');
}

function click( index, elementals ) {
    let _index    = indexs[index];
    if( _index >= 10 ) { return false; }
    indexs[index]++;
    let _elemental = elementals[_index];

    if( isTrue() ) {
        $(_elemental).prop( 'checked',  true );
        $(_elemental).prop( 'disabled', false );
        pct_changed( changed_values * -1 );
        successes[index]++;
    } else {
        $(_elemental).prop( 'checked',  false );
        $(_elemental).prop( 'disabled', true );
        pct_changed( changed_values );
    }
    counts[index]++;

    $($('.successes')[index]).text('+' + successes[index] + ' / ' + (10 - counts[index]));

    let _count = counts[0] + counts[1] + counts[2];
    if( _count >= 30 ) { 
        open_modal();
    }
}

$(document).ready(() => {
    $('.btn').click(function() {
        //let checkboxs = $(this).parent().children().filter('input');
        //console.log(checkboxs[0]);
        click( 
            id_to_index[$(this).attr('id')], 
            $($(this).parent().parent().children()[0]).children().filter('input') 
        );
    });
    
    $(document).click(event => {
        if( event.target == $('#myModal')[0] ) {
            $('#myModal').css('display', 'none');
        }
    });
})