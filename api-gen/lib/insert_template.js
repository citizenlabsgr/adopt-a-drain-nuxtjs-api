
module.exports = class InsertTemplate {
    constructor(version, chelateList) {
        this.chelateList = chelateList;
        this.version = version;
    }
    
    toInsert(chelate) {
        return `
        insert into base_${this.version}.one
        (pk, sk, tk, form, owner)
        values (
            '${chelate.pk}',
            '${chelate.sk}',
            '${chelate.tk}',
            '${JSON.stringify(chelate.form)}'::JSONB,
            '${chelate.owner}'
        );
        `;
    }

    toString() {
        let rc = "";
        for (let i in this.chelateList) {
            rc += this.toInsert(this.chelateList[i]);
        }
        return rc;
    }
};