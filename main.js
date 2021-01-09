$(function() {
	const init = {
		scale: 0.5,
		thinkness: 0.2,
		source: '111\n222\n333'
	}

	const dest = $('#dest').empty();

	const update = function() {
		const source = $('#source').val();

		$.each(source.replace(/[^0-9 \n]/, '').split('\n'), function(index, text) {
			const y = index * 60;

			for (let pos = 0; pos < text.length; ++pos) {
				const ch = text.charAt(pos);
				
				if (/\d/.test(ch)) {
					const elem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
					elem.setAttributeNS(null, 'href', 'digit.svg#d' + ch);
					elem.setAttributeNS(null, 'width', '60');
					elem.setAttributeNS(null, 'height', '60');
					elem.setAttributeNS(null, 'x', pos * 60);
					elem.setAttributeNS(null, 'y', y);

					if (pos == 0) {
						elem.setAttributeNS(null, 'stroke', 'red');
						elem.setAttributeNS(null, 'stroke-width', '.5');
					}
					else {
						elem.setAttributeNS(null, 'stroke-dasharray', '1 1.5');
					}

					dest.append(elem);
				}
			}
		});
	};


	$('#panel').tabs();

	const scale = $('#scale').slider({ min: 0.3, max: 1.0, step: 0.1 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || scale.slider('value');

			dest.attr('transform', `scale(${val} ${val})`);
			$('#bge').attr('patternTransform', `scale(${val} ${val})`);
		});

	const thinkness = $('#thinkness').slider({ min: 0.1, max: 0.7, step: 0.1 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || thinkness.slider('value');

			dest.attr('stroke-width', val);
		});

	$('#source').on('keydown change', function() {
		setTimeout(update, 0);
	});

	$('.inject').each(function() {
		const elem = $(this);
		const value = init[elem.attr('id')];

		if (elem.is('.ui-slider'))
			elem.slider('value', value);
		else
			elem.val(value).trigger('change');
	});
});
