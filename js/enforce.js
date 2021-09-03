
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
    let yagum_value = 0;
    let yagum = 0;
    const yagums = [10, 10, 5, 5, 3];

    let now_yagum = 0;

    let nu_yagum = 0;
    let nu_count = 0;

    let accumulate = {
        'suho': 0, 'wemeng': 0, 'oreha': 0, 'mengpa': 0, 'gold': 0,
        'sun1': 0, 'sun2': 0, 'sun3': 0, 'count': 0
    };

    let now_accumulate = {
        'suho': 0, 'wemeng': 0, 'oreha': 0, 'mengpa': 0, 'gold': 0,
        'sun1': 0, 'sun2': 0, 'sun3': 0, 'count': 0
    };

    const EQUIP_URL_  = "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/MEM_Item/MEM_Item_8.png";
    const WEAPON_URL_ = "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/MEM_Item/MEM_Item_132.png";

    const EQUIP_URL  = "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_6_104.png";
    const WEAPON_URL = "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_6_105.png";

    let init = () => {
        let _this = $('#refining_type');
        let _data = _this.val() === '0' ? weapon : equip;
        let index = Number($('#index_type').val());

        // console.log( $('#yagum_value').is(':checked') );
        $('#yagum_value').prop('checked',  false);
        $('#yagum_value').attr('disabled', index >= 21);
        if( index >= 16 ) {
            yagum_value = yagums[ index - 16 ];
        } else { yagum_value = 10; }

        $('.crystal').attr( 'src', _this.val() === '0' ? WEAPON_URL : EQUIP_URL );
        $('#weapon_img').attr( 'src', _this.val() === '0' ? WEAPON_URL_ : EQUIP_URL_ );
        $('#now_lv' ).text( index - 1 );
        $('#next_lv').text( index );
    
        $('#success'      ).text( comma( _data[index]['success'].toFixed(2) ) );
        $('#crystal_value').text( comma( _data[index]['suho']   ) );
        $('#wemeng_value' ).text( comma( _data[index]['wemeng'] ) );
        $('#oreha_value'  ).text( comma( _data[index]['oreha']  ) );
        $('#mengpa_value' ).text( comma( _data[index]['mengpa'] ) );
        $('#gold_value'   ).text( comma( _data[index]['gold']   ) );

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
        $("#init_btn"   ).attr( 'disabled', false );
    };

    let really_init = () => {
        init();

        nu_count = 0; nu_yagum = 0;
        $('#nu_count_value').text( nu_count );
        $('#nu_yagum_value').text( nu_yagum );

        accumulate = {
            'suho': 0, 'wemeng': 0, 'oreha': 0, 'mengpa': 0, 'gold': 0,
            'sun1': 0, 'sun2': 0, 'sun3': 0
        }; set_all_accumulate_html();
    };

    let now_init = () => {
        now_yagum = 0; now_yagum = 0;

        now_accumulate = {
            'suho': 0, 'wemeng': 0, 'oreha': 0, 'mengpa': 0, 'gold': 0,
            'sun1': 0, 'sun2': 0, 'sun3': 0
        }; set_now_accumulate_html();
    }

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
        $('#nu_crystal_value').text( comma( accumulate['suho']   ) );
        $('#nu_wemeng_value' ).text( comma( accumulate['wemeng'] ) );
        $('#nu_oreha_value'  ).text( comma( accumulate['oreha']  ) );
        $('#nu_mengpa_value' ).text( comma( accumulate['mengpa'] ) );
        $('#nu_gold_value'   ).text( comma( accumulate['gold']   ) );
        $("#nu_sun1_value"   ).text( comma( accumulate['sun1']   ) );
        $("#nu_sun2_value"   ).text( comma( accumulate['sun2']   ) );
        $("#nu_sun3_value"   ).text( comma( accumulate['sun3']   ) );
    }

    let add_now_accumulate = () => {
        let _this = $('#refining_type');
        let _data = _this.val() === '0' ? weapon : equip;
        let index = Number($('#index_type').val());

        now_accumulate['suho']   += _data[index]['suho']   ;
        now_accumulate['wemeng'] += _data[index]['wemeng'] ;
        now_accumulate['oreha']  += _data[index]['oreha']  ;
        now_accumulate['mengpa'] += _data[index]['mengpa'] ;
        now_accumulate['gold']   += _data[index]['gold']   ;
        now_accumulate['sun1']   += Number( $("#sun1_value").text() ) ;
        now_accumulate['sun2']   += Number( $("#sun2_value").text() ) ;
        now_accumulate['sun3']   += Number( $("#sun3_value").text() ) ;
        now_accumulate['count']  += 1;

        set_now_accumulate_html();
    }

    let set_now_accumulate_html = () => {
        let next_index = Number($('#index_type').val());

        $('#success-lv'       ).text( '+' + next_index );
        $('#now_count_value'  ).text( count );
        $('#now_jangi_value'  ).text( jangiback.toFixed(2) + ' %' );
        $('#now_yagum_value'  ).text( now_yagum );
        $('#now_crystal_value').text( comma( now_accumulate['suho']   ) );
        $('#now_wemeng_value' ).text( comma( now_accumulate['wemeng'] ) );
        $('#now_oreha_value'  ).text( comma( now_accumulate['oreha']  ) );
        $('#now_mengpa_value' ).text( comma( now_accumulate['mengpa'] ) );
        $('#now_gold_value'   ).text( comma( now_accumulate['gold']   ) );
        $("#now_sun1_value"   ).text( comma( now_accumulate['sun1']   ) );
        $("#now_sun2_value"   ).text( comma( now_accumulate['sun2']   ) );
        $("#now_sun3_value"   ).text( comma( now_accumulate['sun3']   ) );
    }

    let set_success_rate = () => {
        let _this = $('#refining_type');
        let _data = _this.val() === 0 ? weapon : equip;
        let index = Number($('#index_type').val());

        let success_rate = 
            _data[index]['success'] + 
            fail_up * fail_count;
        
        if( success_rate >= _data[index]['success'] * 2 ) {
            success_rate = _data[index]['success'] * 2;
        }

        success_rate += 
            _data[index]['sun1_count'] * $("#sun1").val() +
            _data[index]['sun2_count'] * $("#sun2").val() +
            _data[index]['sun3_count'] * $("#sun3").val() +
            yagum;

        $('#success').text( success_rate.toFixed(2) );
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
        add_now_accumulate();

        set_success_rate();
        let _rate = Number($('#success').text());
        
        count += 1; nu_count += 1;
        $('#nu_count_value').text( nu_count );

        nu_yagum += $('#yagum_value').is(':checked') ? 1 : 0;
        $('#nu_yagum_value').text( nu_yagum );

        now_yagum += $('#yagum_value').is(':checked') ? 1 : 0;

        if( isTrue( _rate ) || jangiback >= 100 ) {
            console.log('success');

            set_now_accumulate_html();
            $('#myModal').css('display', 'block');
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

    $('#yagum_value').click( () => {
        yagum = $('#yagum_value').is(':checked') ? yagum_value : 0;
        set_success_rate();
    });

    $(document).click(event => {
        let index = Number($('#index_type').val());
        
        if( event.target == $('#myModal')[0] ) {
            $('#myModal').css('display', 'none');

            let next_index = (index + 1);
            if( next_index <= 25 ) {
                $('#index_type').val( next_index + '' );
                init();
            } else {
                $("#enforce_btn").attr( 'disabled', true );
                $("#init_btn").attr(    'disabled', true );
            }

            now_init();
        }
    });

    // for(var i = 1; i <= 9; i++) {
    //     for(var j = 1; j <= 200; j++) {
    //         $('#footer').append(
    //             "<img src='https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_" + i + "_" + j + ".png'/>"
    //         );
    //     }
    // }
    
});
