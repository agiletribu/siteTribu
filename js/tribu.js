//Pour afficher le menu
$(function(){
	    var includes = $('[data-include]');
	    jQuery.each(includes, function(){
	      var file = $(this).data('include') + '.html';
	      $(this).load(file);
	    });
	  });
//Pour afficher tous les membres depuis Prismic
function displayTribuMembers(){
    Helpers.withPrismic(function(ctx) {
        var request = ctx.api.form("everything").ref(ctx.ref);

        var query = '[[:d = at(document.type, "formateur")]]'
        request.query(query);

        request.set('page', parseInt(window.location.hash.substring(1)) || 1 )
            .pageSize(100)
            .submit(function(err, docs) {
            if (err) { Configuration.onPrismicError(err); return; }

            var member = $("#member-template").html();                      
            var member_template = Handlebars.compile(member);

            //Change result to an object
            var all_tribu_members = convertTribuMembersToObject(docs.results);

            $("#members").html(member_template(all_tribu_members))
        });
    });
}


function TribuMember(id, slug, name, photoUrl, extrait_bio, full_bio, liens) {
    this.id = id;
    this.slug = slug;
    this.name = name;
    this.photoUrl = photoUrl;
    this.extrait_bio = extrait_bio;
    this.full_bio = full_bio;
    this.liens = liens;
   
    this.url = function() {return "http://formation.agiletribu.com/formateur.html?id="+this.id+"&slug="+this.slug;};
}

function convertTribuMembersToObject(prismicResults){
    formateurObjectList = [];

    prismicResults.forEach(function(prismic_formateur){

        var bio = prismic_formateur.getStructuredText('formateur.bio');
        var extrait = _.take(bio.getFirstParagraph().text.split(' '), 40).join(' ');
        extrait += " ..."

        var liens = [];        
        if(prismic_formateur.data['formateur.liens']){
            var prismicLiens = prismic_formateur.data['formateur.liens'].value;
            prismicLiens.forEach(function(prismic_lien){
                var type = prismic_lien.site.value;
                var url = prismic_lien.url.value.url;                
                var html_lien = '<a href="' + url +'" class="link-social"><i class="fa fa-' + type + '" aria-hidden="true"></i></a>';

                liens.push(html_lien);
            });
        }

        var member = new TribuMember(prismic_formateur.id, prismic_formateur.slug, prismic_formateur.data['formateur.name'].value,
            prismic_formateur.data['formateur.image'].value.main.url, extrait, bio.asHtml(), liens);

        formateurObjectList.push(member);
    });

    return formateurObjectList;
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

        var contribution = new Contribution(prismic_contrib.id, prismic_contrib.uid,
            prismic_contrib.getStructuredText('contribution.titre').asHtml(),
            imageUrl, prismic_contrib.data['contribution.categorie'].value, prismic_contrib.data['contribution.theme'].value, extrait);

        contributionObjectList.push(contribution);
    });

    return contributionObjectList;
}

//Pour lister toutes les formations stockées dans prismic
function displayFormationsList(){
    var query = '[[:d = at(document.type, "offre-formation")]]';

    Helpers.withPrismic(function(ctx) {
        var request = ctx.api.form("everything").ref(ctx.ref);
        request.query(query);
        request.set('page', parseInt(window.location.hash.substring(1)) || 1 )
            .pageSize(100)
            .submit(function(err, docs) {
            if (err) { Configuration.onPrismicError(err); return; }

            console.log(docs.results)
            //Change result to an object
            var all_contrib = convertFormationsToObject(docs.results);
            var contrib = $("#contribution-item-template").html();                      
            var contrib_template = Handlebars.compile(contrib);

            $("#contrib_formations").html(contrib_template(all_contrib));
        });
    });
}

function Formation(id, uid, titre, imageUrl, contenu, type, duree, tarif) {
    this.id = id;
    this.uid = uid;
    this.titre = titre;
    this.imageUrl = imageUrl;
    this.contenu = contenu;
    this.type = type;
    this.duree = duree;
    this.tarif = tarif;
    this.url = function() {return "/Formation-details.html?uid="+this.uid;};
}

function convertFormationsToObject(prismicResults){
    formationObjectList = [];

    prismicResults.forEach(function(prismic_contrib){

        var contenu = prismic_contrib.getStructuredText('offre-formation.contenu');

        var imageUrl = "/img/favicon.ico";

        if(contenu.getFirstImage()){
            imageUrl = contenu.getFirstImage().url;
        }

        var extrait = _.take(contenu.asText().split(' '), 50).join(' ');
        extrait += " ..."

        var formation = new Formation(prismic_contrib.id, prismic_contrib.uid,
            prismic_contrib.getStructuredText('offre-formation.titre').asHtml(),
            imageUrl, extrait, 
            prismic_contrib.data['offre-formation.type_formation'].value,
            prismic_contrib.getStructuredText('offre-formation.duree').asText(),
            prismic_contrib.getStructuredText('offre-formation.tarif').asText()
            );

        formationObjectList.push(formation);
    });

    return formationObjectList;
}

//Pour afficher une page de contenu venant de prismic
function displayFormationDetails(){
    Helpers.withPrismic(function(ctx) {

        // Retrieve the document
        var uid = Helpers.queryString['uid'];
        var id = Helpers.queryString['id'];

        ctx.api.form("everything").ref(ctx.ref).query('[[:d = at(my.offre-formation.uid, "' + uid + '")]]').submit(function(err, docs) {

            if (err) { Configuration.onPrismicError(err); return; }

            var doc = docs.results[0];

            dates = doc.data['offre-formation.prochaines_dates'].value
            dates.forEach(function(date){
                console.log(date)
                console.log(date.date_formation.value)
            });

            // If there is no documents for this id
            if(!doc) {
                document.location = '404.html';
            }

            var titre = doc.getStructuredText('offre-formation.titre').asText();

            document.title = "AgileTribu - " + titre;
            $("#formation_title").text(titre);
            $("#formation_duree").text(doc.getStructuredText('offre-formation.duree').asText());
            $("#formation_tarif").text(doc.getStructuredText('offre-formation.tarif').asText());
            $("#formation_detail").html(doc.getStructuredText('offre-formation.contenu').asHtml());

        });
    });

}