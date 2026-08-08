export interface FeatureCacheEntry{

    featureId:string;

    signature:string;

    geometry:any;

    topologyHash:string;

    timestamp:number;

    hitCount:number;

    memorySize:number;

}

export interface CacheStatistics{

    entries:number;

    hits:number;

    misses:number;

    hitRatio:number;

    memoryUsage:number;

}

export class BRepFeatureRebuildCache{

    private entries:Map<string,FeatureCacheEntry>;

    private maxEntries:number;

    private hits:number;

    private misses:number;

    constructor(maxEntries:number=1000){

        this.entries=new Map();

        this.maxEntries=maxEntries;

        this.hits=0;

        this.misses=0;

    }

    buildSignature(

        featureId:string,

        parameterHash:string,

        topologyHash:string

    ):string{

        return `${featureId}:${parameterHash}:${topologyHash}`;

    }

    has(signature:string):boolean{

        return this.entries.has(signature);

    }

    get(signature:string):FeatureCacheEntry|undefined{

        const entry=this.entries.get(signature);

        if(entry){

            entry.hitCount++;

            entry.timestamp=Date.now();

            this.hits++;

        }else{

            this.misses++;

        }

        return entry;

    }

    put(entry:FeatureCacheEntry):void{

        if(this.entries.size>=this.maxEntries){

            this.evictLRU();

        }

        this.entries.set(entry.signature,entry);

    }

    invalidateFeature(featureId:string):void{

        for(const [key,value] of this.entries){

            if(value.featureId===featureId){

                this.entries.delete(key);

            }

        }

    }

    invalidateAll():void{

        this.entries.clear();

    }

    private evictLRU():void{

        let oldestKey:string|undefined;

        let oldest=Number.MAX_SAFE_INTEGER;

        for(const [key,value] of this.entries){

            if(value.timestamp<oldest){

                oldest=value.timestamp;

                oldestKey=key;

            }

        }

        if(oldestKey){

            this.entries.delete(oldestKey);

        }

    }

    statistics():CacheStatistics{

        const memoryUsage=

            Array.from(this.entries.values())

            .reduce(

                (sum,e)=>sum+e.memorySize,

                0

            );

        const total=this.hits+this.misses;

        return{

            entries:this.entries.size,

            hits:this.hits,

            misses:this.misses,

           