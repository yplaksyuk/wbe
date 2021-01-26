import * as symbols from './symbols.js';

$(function() {
	const config = {
		background: 'bg-grid',
		scale: 0.5,
		thinkness: 0.2,
		color: 1,
		sample: true,
		monospaced: true,
		source: '111\n222\n333'
	}

	const dest = $('#dest');

	const font = Object.assign({ }, symbols.digits, symbols.printed, symbols.special);

	const update = function() {
		const source = $('#source').val();

		const appendSymbol = function(href, x, y) {
			const elem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			elem.setAttributeNS(null, 'href', href);
			elem.setAttributeNS(null, 'width', '12');
			elem.setAttributeNS(null, 'height', '24');
			elem.setAttributeNS(null, 'x', x);
			elem.setAttributeNS(null, 'y', y);

			if (config.sample && x == 0) {
				elem.setAttributeNS(null, 'stroke', 'red');
				elem.setAttributeNS(null, 'stroke-width', '.5');
				elem.setAttributeNS(null, 'stroke-dasharray', 'none');
			}

			dest.append(elem);
		};


		dest.empty();

		$.each(source.split('\n'), function(j, text) {
			let x = 0;
			let y = j * 12;

			for (let i = 0; i < text.length; ++i) {
				const ch = text.charAt(i);
				const spec = font[ch];
				if (spec) {
					appendSymbol(spec.href, x, y);
					x += config.monospaced ? 12 : spec.width + 1;
				}
				else
					x += config.monospaced ? 12 : 6;
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
		});

	const color = $('#color').slider({ min: 0, max: 1, step: 0.01 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || color.slider('value');
			dest.attr('stroke', `rgba(0,0,0,${val})`);
		});

	const style = $('#style')
		.on('click change', function() {
			if (style.prop('checked'))
				dest.each(function() { this.setAttributeNS(null, 'stroke-dasharray', '1 1.5'); });
			else
				dest.each(function() { this.removeAttributeNS(null, 'stroke-dasharray'); });
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
