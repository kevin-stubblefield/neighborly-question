function Buyer(name, desiredSellers) {

    var currentCandidate = 0;

    this.name = name;
    this.desiredSellers = desiredSellers;
    this.partners = [];
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
            var index = entity.partner.partners.indexOf(entity);
            entity.partner.partners.splice(index, 1);
        }
        entity.partner = this;
        if (this.partners.length >= desiredSellers) {
            this.partners.shift();
        }
        this.partners.push(entity);
    }
}

function Seller(name) {
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
}

function galeShapley(proposors) {
    var done = false;
    while (!done) {
        done = true;
        for (var i = 0; i < proposors.length; i++) {
            var proposor = proposors[i];
            if (proposor.partners.length < proposor.desiredSellers) {
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
    var walmart = new Buyer('Walmart', 3);
    var target = new Buyer('Target', 2);
    var zumiez = new Buyer('Zumiez', 1);
    var nordstrom = new Buyer('Nordstrom', 2);
    var kohls = new Buyer('Kohl\'s', 1);

    var mossimo = new Seller('Mossimo');
    var fadedGlory = new Seller('Faded Glory');
    var tommyHilfiger = new Seller('Tommy Hilfiger');
    var hanes = new Seller('Hanes');
    var levis = new Seller('Levi\'s');
    var calvinKlein = new Seller('Calvin Klein');
    var adidas = new Seller('Adidas');
    var vans = new Seller('Vans');
    var docker = new Seller('Docker');

    walmart.candidates = [hanes, docker, levis, calvinKlein, tommyHilfiger, mossimo, adidas, vans, fadedGlory];
    target.candidates = [mossimo, hanes, calvinKlein, docker, tommyHilfiger, adidas, levis, fadedGlory, vans];
    zumiez.candidates = [vans, calvinKlein, levis, hanes, tommyHilfiger, fadedGlory, docker, mossimo, adidas];
    nordstrom.candidates = [calvinKlein, levis, tommyHilfiger, hanes, mossimo, fadedGlory, adidas, vans, docker];
    kohls.candidates = [hanes, levis, docker, calvinKlein, tommyHilfiger, mossimo, adidas, vans, fadedGlory];

    mossimo.candidates = [kohls, target, walmart, nordstrom, zumiez];
    fadedGlory.candidates = [walmart, target, zumiez, nordstrom, kohls];
    tommyHilfiger.candidates = [zumiez, nordstrom, kohls, target, walmart];
    hanes.candidates = [target, walmart, nordstrom, kohls, zumiez];
    levis.candidates = [target, nordstrom, kohls, zumiez, walmart];
    calvinKlein.candidates = [nordstrom, kohls, target, walmart, zumiez];
    adidas.candidates = [target, kohls, nordstrom, walmart, zumiez];
    vans.candidates = [nordstrom, zumiez, target, walmart, kohls];
    docker.candidates = [kohls, zumiez, nordstrom, target, walmart];

    var buyers = [walmart, target, zumiez, nordstrom, kohls];
    
    galeShapley(buyers);

    for (var i = 0; i < buyers.length; i++) {
        var output = buyers[i].name + ' is partnered with ';
        for (var j = 0; j < buyers[i].partners.length; j++) {
            output += buyers[i].partners[j].name;
            if (j < buyers[i].partners.length - 1) {
                output += ', '
            }
        }
        console.log(output);
    }
}

run();