$(function() {

	const update = function() {
		const dest = $('#dest').empty();
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
						elem.setAttributeNS(null, 'stroke-dasharray', '.5 1');
					}

					dest.append(elem);
				}
			}
		});
	};


	$('#panel').tabs();

	$('#source').on('keydown change', function() {
		setTimeout(update, 0);
	});

	$('#source')
		.val('1111111111\n2222222222\n3333333333\n4444444444\n5555555555\n6666666666\n7777777777\n8888888888\n9999999999\n0000000000')
		.trigger('change');
});
