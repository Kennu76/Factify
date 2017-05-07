var psql = global.psql;
var viewPrefix = "v_";
var proceduresPrefix = "insert_"
/** function to create object from shcema fields */
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
/** function to retreive fields that are going to be saved */
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

/** function to fill values by schema fields as keys*/
var fillFieldsToSaveValues = function(obj){
   for(var key in obj._fieldsToSave){
       obj._fieldsToSave[key] = obj[key];
   }
   return obj._fieldsToSave;
}

/** function to fill value fields by schema fields */
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
Prototype for model 
with function to create new modelObject, get mobelObject from database and list all 
every function returns promise;
*/

var ModelProto = {
    create : function(){
        var o = createObjectFromSchema(this.schema);
        return o;
    },
    get : function(id){
        var query = psql.query("SELECT * from " + viewPrefix + this.schema.tablename + " where id = $1",[id]);
        return query;
    },
    delete : function(id){
        var query = psql.query("DELETE from " + this.schema.tablename + " where id = $1",[id]);
        return query;
    },
    list : function(){
        var query = psql.query("SELECT * FROM " + viewPrefix + this.schema.tablename + ";");
        return query;
    },
    findOne : function(key, value){
        var query = psql.query("SELECT * from " + this.schema.tablename + " where " + key + " =  $1 LIMIT 1;",[value]);
        return query;
    },
    find : function(key, value){
        var query = psql.query("SELECT * from " + viewPrefix + this.schema.tablename + " where " + key + " =  $1;",[value]);
        return query;
    }
};

/*
Protototype for modelObject, to save, update or delete single entity
Every query returns promise
*/

var ModelObjectProto = {
    saves : function(){
        var values = [];
        this._fieldsToSave = fillFieldsToSaveValues(this);
        var keyValues = getKeysAndValues(this._fieldsToSave);

        if(this._tablename == 'facts')
            values = [this._fieldsToSave.fact, this._fieldsToSave.title, this._fieldsToSave.user_id];
        if(this._tablename == 'users')
            values = [this._fieldsToSave.username, this._fieldsToSave.firstname, this._fieldsToSave.lastname, this._fieldsToSave.password, this._fieldsToSave.email];
        if(this._tablename == 'votes')
            values = [this._fieldsToSave.user_id, this._fieldsToSave.fact_id, this._fieldsToSave.type];


        var query = "SELECT * from " + proceduresPrefix + this._tablename + "('" + values.join("','") + "');"; 
        console.log(query);
        return psql.query(query, keyValues.values);
    },
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


/**
 * function to create new model, which is used to create entities or query 
 */
var modelFactory = function(schema){
    var model = Object.create(ModelProto);
    model.schema = schema;
    return model;
}

module.exports = modelFactory;