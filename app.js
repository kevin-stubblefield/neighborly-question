function Entity(name) {

    var currentCandidate = 0;

    this.name = name;
    this.partner = null;
    this.candidates = [];

    this.rank = function(entity) {
        for (var i = 0; i < this.candidates.length; i++) {
            if (this.candidates[i] === entity) return i;
        }
        return this.candidates.length + 1;
    }

    this.prefers = function(entity) {
        return this.rank(entity) < this.rank(this.partner);
    }

    this.next = function() {
        if (currentCandidate >= this.candidates.length) return null;
        return this.candidates[currentCandidate++];
    }

    this.partnerUp = function(entity) {
        if (entity.partner) {
            entity.partner.partner = null;
        }
        entity.partner = this;
        if (this.partner) {
            this.partner.partner = null;
        }
        this.partner = entity;
    }
}

function stableMatching(proposors) {
    var done = false;
    while (!done) {
        done = true;
        for (var i = 0; i < proposors.length; i++) {
            var proposor = proposors[i];
            if (!proposor.partner) {
                done = false;
                var acceptor = proposor.next();
                if (!acceptor.partner || acceptor.prefers(proposor)) {
                    proposor.partnerUp(acceptor);
                }
            }
        }
    }
}

function run() {
    var bingley = new Entity('Bingley');
    var wickham = new Entity('Wickham');
    var collins = new Entity('Collins');
    var darcy = new Entity('Darcy');
    var charlotte = new Entity('Charlotte');
    var elizabeth = new Entity('Elizabeth');
    var jane = new Entity('Jane');
    var lydia = new Entity('Lydia');

    bingley.candidates = [jane, elizabeth, lydia, charlotte];
    wickham.candidates = [lydia, jane, elizabeth, charlotte];
    darcy.candidates = [elizabeth, jane, charlotte, lydia];
    collins.candidates = [jane, elizabeth, lydia, charlotte];
    charlotte.candidates = [bingley, darcy, collins, wickham];
    elizabeth.candidates = [wickham, darcy, bingley, collins];
    jane.candidates = [bingley, wickham, darcy, collins];
    lydia.candidates = [bingley, wickham, darcy, collins];

    var guys = [bingley, darcy, collins, wickham];
    
    stableMatching(guys);

    for (var i = 0; i < guys.length; i++) {
        console.log('%s is engaged to %s', guys[i].name, guys[i].partner.name);
    }
}

run();

