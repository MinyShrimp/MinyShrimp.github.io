
function getRandom() {
    return Math.floor(Math.random() * 10000);
}

function isTrue( pct ) {
    let _random = getRandom();
    return _random < ( pct * 100 );
}

function comma( num ) {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready( () => {
    let equip = weapon = 0;
    let add_values = [ 0, 0, 0 ];
    let jangiback = 0;
    let fail_up = 0;
    let fail_count = 0;
    let count = 0;

    let accumulate = {
        'suho': 0, 'wemeng': 0, 'oreha': 0, 'mengpa': 0, 'gold': 0,
        'sun1': 0, 'sun2': 0, 'sun3': 0, 'count': 0
    };

    let now_accumulate = {
        'suho': 0, 'wemeng': 0, 'oreha': 0, 'mengpa': 0, 'gold': 0,
        'sun1': 0, 'sun2': 0, 'sun3': 0, 'count': 0
    };

    const EQUIP_URL  = "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_6_104.png";
    const WEAPON_URL = "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_6_105.png";

    let init = () => {
        let _this = $('#refining_type');
        let _data = _this.val() === '0' ? weapon : equip;
        let index = Number($('#index_type').val());

        $('.crystal').attr( 'src', _this.val() === '0' ? WEAPON_URL : EQUIP_URL );
        $('#now_lv').text(  index - 1 );
        $('#next_lv').text( index );
    
        $('#success').text(       comma( _data[index]['success'].toFixed(2) ) );
        $('#crystal_value').text( comma( _data[index]['suho']   ) );
        $('#wemeng_value').text(  comma( _data[index]['wemeng'] ) );
        $('#oreha_value').text(   comma( _data[index]['oreha']  ) );
        $('#mengpa_value').text(  comma( _data[index]['mengpa'] ) );
        $('#gold_value').text(    comma( _data[index]['gold']   ) );

        $("#sun1_value").text( '0' );
        $("#sun2_value").text( '0' );
        $("#sun3_value").text( '0' );

        $("#sun1").val( '0' );
        $("#sun2").val( '0' );
        $("#sun3").val( '0' );
    
        $("#sun1").attr( "max", _data[index]['sun1'] );
        $("#sun2").attr( "max", _data[index]['sun2'] );
        $("#sun3").attr( "max", _data[index]['sun3'] );

        $('#jangiback').text( '0.00' );
        $('#count').text( 0 );

        add_values = [
            _data[index]['sun1_count'],
            _data[index]['sun2_count'],
            _data[index]['sun3_count']
        ];

        fail_up = _data[index]['fail_up'];
        jangiback = 0; fail_count = 0; count = 0;

        $("#enforce_btn").attr( 'disabled', false );
        $("#init_btn").attr(    'disabled', false );
    };

    let really_init = () => {
        init();

        accumulate = {
            'suho': 0, 'wemeng': 0, 'oreha': 0, 'mengpa': 0, 'gold': 0,
            'sun1': 0, 'sun2': 0, 'sun3': 0
        };
        set_all_accumulate_html();
    };

    let add_all_accumulate = () => {
        let _this = $('#refining_type');
        let _data = _this.val() === '0' ? weapon : equip;
        let index = Number($('#index_type').val());

        accumulate['suho']   += _data[index]['suho']   ;
        accumulate['wemeng'] += _data[index]['wemeng'] ;
        accumulate['oreha']  += _data[index]['oreha']  ;
        accumulate['mengpa'] += _data[index]['mengpa'] ;
        accumulate['gold']   += _data[index]['gold']   ;
        accumulate['sun1']   += Number( $("#sun1_value").text() ) ;
        accumulate['sun2']   += Number( $("#sun2_value").text() ) ;
        accumulate['sun3']   += Number( $("#sun3_value").text() ) ;
        accumulate['count']  += 1;

        set_all_accumulate_html();
    }

    let set_all_accumulate_html = () => {
        $('#nu_crystal_value').text( comma( accumulate['suho']  ) );
        $('#nu_wemeng_value').text(  comma( accumulate['wemeng']) );
        $('#nu_oreha_value').text(   comma( accumulate['oreha'] ) );
        $('#nu_mengpa_value').text(  comma( accumulate['mengpa']) );
        $('#nu_gold_value').text(    comma( accumulate['gold']  ) );
        $("#nu_sun1_value").text(    comma( accumulate['sun1']  ) );
        $("#nu_sun2_value").text(    comma( accumulate['sun2']  ) );
        $("#nu_sun3_value").text(    comma( accumulate['sun3']  ) );
    }

    let set_success_rate = () => {
        let _this = $('#refining_type');
        let _data = _this.val() === 0 ? weapon : equip;
        let index = Number($('#index_type').val());

        $('#success').text(  
            ( _data[index]['success'] + 
            _data[index]['sun1_count'] * $("#sun1").val() +
            _data[index]['sun2_count'] * $("#sun2").val() +
            _data[index]['sun3_count'] * $("#sun3").val() +
            fail_up * fail_count ).toFixed(2)
        );
    }

    $.getJSON( "./data/equip.json", _equip => {
        equip = _equip;
        $.getJSON( "./data/weapon.json", _weapon => {
            weapon = _weapon;
            init();
        });
    });
    
    $('#refining_type').on("change", init);
    $('#index_type').on(   "change", init);

    $("#sun1").on("input", () => {
        $("#sun1_value").text( $("#sun1").val() )
        set_success_rate();
    });
    $("#sun2").on("input", () => {
        $("#sun2_value").text( $("#sun2").val() )
        set_success_rate();
    });
    $("#sun3").on("input", () => {
        $("#sun3_value").text( $("#sun3").val() )
        set_success_rate();
    });

    $("#enforce_btn").on('click', () => {
        add_all_accumulate();
        set_success_rate();
        let _rate = Number($('#success').text());
        let index = Number($('#index_type').val());
        count += 1;

        if( isTrue( _rate ) || jangiback >= 100 ) {
            console.log('success');

            let next_index = (index + 1);
            if( next_index <= 25 ) {
                $('#index_type').val( next_index + '' );
                init();
            } else {
                $("#enforce_btn").attr( 'disabled', true );
                $("#init_btn").attr(    'disabled', true );
            }
        } else {
            console.log('fail');
            jangiback  += _rate * 0.465;
            if( jangiback > 100 ) { jangiback = 100; }
            fail_count += 1;
            $('#jangiback').text( jangiback.toFixed(2) );
            $('#count').text( count );

            set_success_rate();
        }
    });
    $('#init_btn').on( "click", really_init );
});