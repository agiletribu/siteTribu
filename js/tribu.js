function displayContributionDetails(){
    Helpers.withPrismic(function(ctx) {

        // Retrieve the document
        var uid = Helpers.queryString['uid'];
        var id = Helpers.queryString['id'];

        ctx.api.form("everything").ref(ctx.ref).query('[[:d = at(document.id, "' + id + '")]]').submit(function(err, docs) {

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