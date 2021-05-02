import * as symbols from './symbols.js';

$(function() {
	const config = {
		background: 'bg-grid',
		scale: 0.5,
		thinkness: 0.2,
		color: 0,
		sample: true,
		cursive: false,
		monospaced: true,
		source: '111\n222\n333'
	}

	const dest = $('#dest');

	const font = Object.assign({ }, symbols.digits, symbols.printed, symbols.special);

	const update = function() {
		const source = $('#source').val();

		const appendSymbol = function(spec, pos) {
			if (spec) {
				const x = pos.x + (config.monospaced ? 0 : 0.5 + (spec.width - 12) / 2);
				const y = pos.y;

				const elem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
				elem.setAttributeNS(null, 'href', spec.href);
				elem.setAttributeNS(null, 'width', '24');
				elem.setAttributeNS(null, 'height', '24');
				elem.setAttributeNS(null, 'x', x);
				elem.setAttributeNS(null, 'y', y - 0.15);

				if (config.sample && pos.x == 0) {
					elem.setAttributeNS(null, 'stroke', 'red');
					elem.setAttributeNS(null, 'stroke-width', '.5');
					elem.setAttributeNS(null, 'stroke-dasharray', 'none');
				}

				dest.append(elem);

				pos.x += config.monospaced ? 12 : spec.width + 1.5;
			}
			else
				pos.x += config.monospaced ? 12 : 6;
		};


		dest.empty();

		$.each(source.split('\n'), function(j, text) {
			const pos = { x: 0, y: j * 12 };

			for (let i = 0; i < text.length; ++i) {
				const ch = text.charAt(i);
				const spec = font[ch];

				appendSymbol(spec, pos);
			}
		});
	};


	$('#panel').tabs();

	const background = $('#background')
		.on('change', function() {
			const val = background.val();
			$('#backgroundRect').attr('style', `fill: url(#${val})`);
		});

	const scale = $('#scale').slider({ min: 0.3, max: 1.0, step: 0.01 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || scale.slider('value');

			dest.attr('transform', `scale(${val} ${val})`);
			$('.backgroundPattern').attr('patternTransform', `scale(${val} ${val})`);
		});

	const thinkness = $('#thinkness').slider({ min: 0.1, max: 0.7, step: 0.01 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || thinkness.slider('value');
			dest.attr('stroke-width', val);

			$('#style').trigger('update');
		});

	const color = $('#color').slider({ min: 0, max: 255, step: 1 })
		.on('slidechange slide', function(event, ui) {
			const val = 255 - (ui.value || color.slider('value'));
			dest.attr('stroke', `rgb(${val}, ${val},${val})`);
		});

	const style = $('#style')
		.on('click change update', function() {
			if (style.prop('checked')) {
				const val = thinkness.slider('value') * 0.2;
				dest.each(function() { this.setAttributeNS(null, 'stroke-dasharray', `${val},${val * 10}`); });
			}
			else
				dest.each(function() { this.removeAttributeNS(null, 'stroke-dasharray'); });
		});

	const cursive = $('#cursive')
		.on('click change', function() {
			Object.assign(font,  cursive.prop('checked') ? symbols.cursive : symbols.printed );
			setTimeout(update, 0);
		});

	const border = $('#border')
		.on('click change', function() {
			$('#borderLine').toggle(border.prop('checked'));
		});

	$('#sample,#monospaced,#source').on('keydown change', function() {
		setTimeout(update, 0);
	});

	// --

	const storage = window.localStorage;
	$('.inject')
		.on('change slidechange', function() {
			const elem = $(this);
			const name = elem.attr('id');

			const setValue = function(val) {
				storage.setItem(name, config[name] = val);
			};

			if (elem.is('.ui-slider'))
				setValue(elem.slider('value'));
			else if (elem.is(':checkbox'))
				setValue(elem.prop('checked'));
			else
				setValue(elem.val());
		})
		.each(function() {
			const elem = $(this);
			const name = elem.attr('id');
			const value = storage.getItem(name) || config[name];

			if (elem.is('.ui-slider'))
				elem.slider('value', value);
			else if (elem.is(':checkbox'))
				elem.prop('checked', value === 'true');
			else
				elem.val(value);

			elem.trigger('change');
		});
});
