gestdocRequest = [];
window.addEventListener('load', function () {

    $(".btn--white").on("click", function () {
        console.log(this)
        console.log($(this).attr('id'))

        $.ajax({
            type: "POST",
            url: 'https://flow.gestdoc.cl/api/documento',
            data: { bpmn: $(this).attr('id') },
            success: (data => {
             window.location.href = "https://flow.gestdoc.cl/procedure/" + data.id
            })
        });

    });


    var http = new XMLHttpRequest();
    var url = 'https://flow.gestdoc.cl/api/tramites';
    var params = '';
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            gestdocRequest = JSON.parse(http.responseText);
        }
    }
    http.send(params);

    $(".article--doc").on("click", function () {
        console.log("article--docs")
        $(".modal--docs").addClass("modal--in");
        var category = $(this).attr('id')
        var htmlBody = ''
        document.getElementById('block-list').innerHTML = ''
        var justFound = findCategory(category, gestdocRequest)
        htmlBody = htmlListDocs(justFound);
    });

    document.getElementById("search").addEventListener("keyup", function () {
        var htmlBody = ''
        if (this.value.length >= 3) {
            document.getElementById('block-list').innerHTML = ''
            var justFound = findWords(this.value, gestdocRequest)
            htmlBody = htmlList(justFound);
            $(".section__search__results").addClass("section__search__results--show");
        }
        else {
            $(".section__search__results").removeClass("section__search__results--show");
            $(".section__search").removeClass("section__search--openinfo")
        }
    });
})

function displayNews(section) {
    var element = document.createElement('div');
    var element_tag = document.createElement('div');
    var element_name = document.createElement('div');
    var element_link = document.createElement('a');

    element.classList.add("section__search__result");
    element_tag.classList.add("section__search__tag");
    element_name.classList.add("section__search__name");
    element.onclick = function () {
        selectedItem(section);
    };

    var lastword = section._nameSchema.split(" ").pop();

    var lastIndex = section._nameSchema.lastIndexOf(" ");
    var justFirstWords = section._nameSchema.substring(0, lastIndex);

    element_link.innerHTML = justFirstWords
    /*element_link.href= section._link; */
    /* element_link.target= "_blank"; */
    element_tag.innerHTML = lastword
    element_tag.innerHTML = lastword

    element.appendChild(element_name);
    element.appendChild(element_tag);
    element_name.appendChild(element_link);
    document.getElementById("block-list").appendChild(element);
}

function displayNewsDocs(section) {
    var element = document.createElement('div');
    var element_tag = document.createElement('div');
    var element_name = document.createElement('div');
    var element_link = document.createElement('a');

    element.classList.add("modal__search__result");
    element_tag.classList.add("modal__search__tag");
    element_name.classList.add("modal__search__name");
    element.onclick = function () {
        selectedItemDocs(section);
    };

    var lastword = section._nameSchema.split(" ").pop();

    var lastIndex = section._nameSchema.lastIndexOf(" ");
    var justFirstWords = section._nameSchema.substring(0, lastIndex);

    element_link.innerHTML = justFirstWords
    /*element_link.href= section._link; */
    /* element_link.target= "_blank"; */
    element_tag.innerHTML = lastword
    element_tag.innerHTML = lastword

    element.appendChild(element_name);
    element.appendChild(element_tag);
    element_name.appendChild(element_link);
    document.getElementById("block-list").appendChild(element);
}

function selectedItem(item) {
    $(".section__info__items").empty();
    $(".section__search").addClass("section__search--openinfo")
    $(".section__search__box .section__info__tag").text(item._category)
    $(".section__search__box .section__info__name").text(item._nameSchema)
    $(".section__search__box .section__info__description").text(item._description)
    $(".section__search__box .section__info__link a").attr("href", item._link)
    $(".btn--white").attr("id", item._id)
    $(".btn--white").removeAttr("href");

    item._requirements.forEach(function (value, index, array) {
        var element_req = document.createElement('div');
        element_req.classList.add("section__info__item");
        element_req.innerHTML = value
        document.getElementById("info-list").appendChild(element_req);
    });


}

function selectedItemDocs(item) {
    $(".modal__info__items").empty();
    $(".modal--docs .modal__front").addClass("modal__front--openinfo")
    $(".modal__search__box .modal__info__tag").text(item._category)
    $(".modal__search__box .modal__info__name").text(item._nameSchema)
    $(".modal__search__box .modal__info__description").text(item._description)
    $(".modal__search__box .modal__info__link a").attr("href", item._link)
    $(".btn--white").attr("id", item._id)
    $(".btn--white").removeAttr("href");

    item._requirements.forEach(function (value, index, array) {
        var element_req = document.createElement('div');
        element_req.classList.add("modal__info__item");
        element_req.innerHTML = value
        document.getElementById("info-list").appendChild(element_req);
    });


}

const htmlList = list => {
    // Si hay resultados los agrego a los resultados y boro div con documentos no encontrados
    if (list.length > 0) {
        $(".section__search__results__notfound").removeClass("section__search__results__notfound--show");
        for (let i = 0; i < list.length; i++) {
            displayNews(list[i])
        }
    }
    // Si no hay resultados activo div con documentos no encontrados
    else {

        $(".section__search__results__notfound").addClass("section__search__results__notfound--show");
    }
}

const htmlListDocs = list => {
    // Si hay resultados los agrego a los resultados y boro div con documentos no encontrados
    for (let i = 0; i < list.length; i++) {
        displayNewsDocs(list[i])
    }

}

const findCategory = (category, gestdocRequest) => {
const result = gestdocRequest.filter(list => list._category == category);
return result
}

const findWords = (word, list) => {
    var parseList = JSON.parse(JSON.stringify(list));
    console.log(typeof parseList)
    parseList.map(e => {
        e._nameSchema = removeAccentsAndUpper(e._nameSchema)
        return { ...e };
    })
    var parseWord = removeAccentsAndUpper(word)
    let upperList = parseList.filter(e => e._nameSchema.search(parseWord) !== -1).map(e => { return e._id })
    const normalList = list.filter(e => { return upperList.indexOf(e._id) !== -1; });
    return normalList;
}

const removeAccentsAndUpper = (str) => {
    let result = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return result.toUpperCase();
}