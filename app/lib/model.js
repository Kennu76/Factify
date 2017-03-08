var psql = global.psql;

var createObjectFromSchema = function(schema){
   var o = Object.create(ModelObjectProto); 
   for(var key in schema.fields){
       if(schema.fields.hasOwnProperty(key)){
           o[key] = null;
       }
   }
   o._fieldsToSave = getSchemaFieldsToSave(schema);
   o._tablename = schema.tablename; 
   return o;
}

var getSchemaFieldsToSave = function(schema){
   var save = Object.create(null);

   for(var key in schema.fields){
       if(schema.fields.hasOwnProperty(key)){
           if(schema.fields[key].auto && schema.fields[key].auto === true)
                continue;
            else
                save[key] = null;
       }
   }
   return save;
}

var fillFieldsToSaveValues = function(obj){
   for(var key in obj._fieldsToSave){
       obj._fieldsToSave[key] = obj[key];
   }
   return obj._fieldsToSave;
}

var getKeysAndValues = function(fieldsToSave){
    var keys = [];
    var values = [];

    for(var key in fieldsToSave){
        keys.push(key);
        values.push(fieldsToSave[key]);
    }

    return {keys: keys, values : values};
}

var getUpdateKeyValueString = function(keyValues){
    var r = "";
    keyValues.keys.forEach(function(key, id){
        r += key + " = "  + "$" + (id + 1) + (id!=keyValues.keys.length-1?",":"");
    });

    return r;
}

var getUpdatedAtString = function(obj){
    if(obj.hasOwnProperty('updated_at')) 
        return ", updated_at = DEFAULT";
    else 
        return "";
}

var mapValuesToParameters = function(values){
    return values.map(function(el, id){
       return "$" + (id + 1);
    });
}

/*
kõik crud meetodid tagastavad promise'i
*/

var ModelProto = {
    create : function(){
        var o = createObjectFromSchema(this.schema);
        return o;
    },
    get : function(){
        ("SELECT from" + this.schema.tablename + "where id = $1", id);
    },
    list : function(){
        query = psql.query("SELECT * FROM " + this.schema.tablename + ";");
        return query;
    }
};

var ModelObjectProto = {
    save : function(){
        this._fieldsToSave = fillFieldsToSaveValues(this);
        var keyValues = getKeysAndValues(this._fieldsToSave);

        var query = "INSERT INTO " + this._tablename + "(" + keyValues.keys.join(", ") + ") VALUES (" + mapValuesToParameters(keyValues.values).join() + ");"; 
        return psql.query(query, keyValues.values);
    },
    update : function(){
        this._fieldsToSave = fillFieldsToSaveValues(this);
        var keyValues = getKeysAndValues(this._fieldsToSave);

        var query = "UPDATE " + this._tablename + " SET " + getUpdateKeyValueString(keyValues) + getUpdatedAtString(this) + " WHERE id = "+  this.id + ";"; 
        return psql.query(query, keyValues.values);
    },
    delete : function(){
        console.log(this.id);
    },
}

var modelFactory = function(schema){
    var model = Object.create(ModelProto);
    model.schema = schema;
    return model;
}

module.exports = modelFactory;