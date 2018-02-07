//Pour afficher une page de contenu venant de prismic
function displayContributionDetails(){
    Helpers.withPrismic(function(ctx) {

        // Retrieve the document
        var uid = Helpers.queryString['uid'];
        var id = Helpers.queryString['id'];

        ctx.api.form("everything").ref(ctx.ref).query('[[:d = at(my.contribution.uid, "' + uid + '")]]').submit(function(err, docs) {

            if (err) { Configuration.onPrismicError(err); return; }

            var doc = docs.results[0];

            // If there is no documents for this id
            if(!doc) {
                document.location = '404.html';
            }

            var titre = doc.getStructuredText('contribution.titre').asText();

            document.title = "AgileTribu - " + titre;
            $("#contribution_title").text(titre);
            $("#contribution-detail").html(doc.getStructuredText('contribution.contenu').asHtml());

        });
    });

}

//Pour lister tous les contenus stockés dans prismic
function displayContributionsList(){
    var query = generateQueryFromSelections();

    Helpers.withPrismic(function(ctx) {
        var request = ctx.api.form("everything").ref(ctx.ref);

        request.query(query);

        request.set('page', parseInt(window.location.hash.substring(1)) || 1 )
            .pageSize(100)
            .submit(function(err, docs) {
            if (err) { Configuration.onPrismicError(err); return; }


            //Change result to an object
            var all_contrib = convertContribToObject(docs.results);

            var contrib = $("#contribution-item-template").html();                      
            var contrib_template = Handlebars.compile(contrib);

            var services = _.filter(all_contrib, _.iteratee(['categorie', 'service']));
            console.log(services);
            var partages = _.filter(all_contrib, _.iteratee(['categorie', 'partage']));
            var communautes = _.filter(all_contrib, _.iteratee(['categorie', 'communaute']));

            $("#contrib_services").html(contrib_template(services));
            $("#contrib_partages").html(contrib_template(partages));
            $("#contrib_communautes").html(contrib_template(communautes));

        });
    });
}

function generateQueryFromSelections (){
    var query = "[";

    query += '[:d = at(document.type, "contribution")]';

    var selectedTheme = $('#theme_filter input:radio:checked').val();
    if(selectedTheme){
        query += '[:d = at(my.contribution.theme, "' + selectedTheme + '")]';        
    }

    var searchQuery = $('#searchQuery').val();
    if(searchQuery){
        query += '[:d = fulltext (document, "' + searchQuery + '")]';
    }

    query += "]"
    return query;
}

function Contribution(id, uid, titre, imageUrl, categorie, theme, contenu) {
    this.id = id;
    this.uid = uid;
    this.titre = titre;
    this.imageUrl = imageUrl;
    this.categorie = categorie;
    this.theme = theme;
    this.contenu = contenu;
   
    this.url = function() {return "/contenu.html?uid="+this.uid;};
}

function convertContribToObject(prismicResults){
    contributionObjectList = [];

    prismicResults.forEach(function(prismic_contrib){

        var contenu = prismic_contrib.getStructuredText('contribution.contenu');

        var imageUrl = "/img/favicon.ico";

        if(contenu.getFirstImage()){
            imageUrl = contenu.getFirstImage().url;
        }

        var extrait = _.take(contenu.asText().split(' '), 50).join(' ');
        extrait += " ..."

        var contribution = new Contribution(prismic_contrib.id, prismic_contrib.uid, prismic_contrib.getStructuredText('contribution.titre').asHtml(),
            imageUrl, prismic_contrib.data['contribution.categorie'].value, prismic_contrib.data['contribution.theme'].value, extrait);

        contributionObjectList.push(contribution);
    });

    return contributionObjectList;
}