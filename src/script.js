let eleQuery = ['.col-md-12', '#panel-visitors', '#panel-requests', '#panel-static_requests', '#panel-not_found', '#panel-hosts', '#panel-os', '#panel-browsers', '#panel-visit_time', '#panel-referring_sites', '#panel-status_codes'];

let element = $('.col-md-12')[0];

let image = $('#img')[0];

let btn = $('#btn');

btn.click(function () {
    eleQuery.forEach((item, index) => {
        element = $(item)[0];
        image = $(`#img${index}`)[0];
        console.log(element, image);
        svgHandler(item);
        convertToImage(element, image);
    });
});

// svg的处理
function svgHandler(sel) {
    let nodesToRecover = [];
    let nodesToRemove = [];
    let svgElem = $(sel).find('svg');
    svgElem.each((index, node) => {
        let parentNode = node.parentNode;
        let svg = node.outerHTML.trim();

        let canvas = document.createElement('canvas');
        canvg(canvas, svg);
        if (node.style.position) {
            canvas.style.position += node.style.position;
            canvas.style.left += node.style.left;
            canvas.style.top += node.style.top;
        }

        nodesToRecover.push({
            parent: parentNode,
            child: node
        });
        parentNode.removeChild(node);

        nodesToRemove.push({
            parent: parentNode,
            child: canvas
        });

        parentNode.appendChild(canvas);
    });
}

function convertToImage(source, image) {
    html2canvas(source).then(function (canvas) {
        let imageData = canvas.toDataURL(1);
        console.log('imageData', imageData);
        image.src = imageData;
        axios.post('http://localhost:2018/snap?id=1022', imageData).then(rs => {
            console.log(rs);
        }).catch(err => {
            console.log(err);
        });
    });
}
