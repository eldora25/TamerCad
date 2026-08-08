import { BRepFeatureManager } from "../features/BRepFeatureManager";
import { BRepFeatureDependency } from "../features/BRepFeatureDependency";
import { BRepFeatureRebuildPlanner } from "../features/BRepFeatureRebuildPlanner";
import { BRepFeatureRebuildQueue } from "../features/BRepFeatureRebuildQueue";
import { BRepFeatureRebuildScheduler } from "../features/BRepFeatureRebuildScheduler";
import { BRepFeatureRebuildWorkerPool } from "../features/BRepFeatureRebuildWorkerPool";
import { BRepFeatureRebuildMonitor } from "../features/BRepFeatureRebuildMonitor";
import { BRepFeatureRebuildOptimizer } from "../features/BRepFeatureRebuildOptimizer";
import { BRepFeatureRebuildCache } from "../features/BRepFeatureRebuildCache";

export interface ParametricParameter{

    id:string;

    value:any;

}

export class BRepParametricModel{

    readonly parameters = new Map<string,ParametricParameter>();

    readonly featureManager: BRepFeatureManager;

    readonly dependency: BRepFeatureDependency;

    readonly planner: BRepFeatureRebuildPlanner;

    readonly queue: BRepFeatureRebuildQueue;

    readonly scheduler: BRepFeatureRebuildScheduler;

    readonly workerPool: BRepFeatureRebuildWorkerPool;

    readonly monitor: BRepFeatureRebuildMonitor;

    readonly optimizer: BRepFeatureRebuildOptimizer;

    readonly cache: BRepFeatureRebuildCache;

    revision:number = 0;

    constructor(

        featureManager:BRepFeatureManager,

        dependency:BRepFeatureDependency,

        scheduler:BRepFeatureRebuildScheduler,

        workerPool:BRepFeatureRebuildWorkerPool

    ){

        this.featureManager=featureManager;

        this.dependency=dependency;

        this.planner=new BRepFeatureRebuildPlanner(dependency);

        this.queue=new BRepFeatureRebuildQueue();

        this.scheduler=scheduler;

        this.workerPool=workerPool;

        this.monitor=new BRepFeatureRebuildMonitor();

        this.optimizer=new BRepFeatureRebuildOptimizer();

        this.cache=new BRepFeatureRebuildCache();

    }

    addParameter(id:string,value:any){

        this.parameters.set(id,{id,value});

    }

    updateParameter(id:string,value:any){

        const p=this.parameters.get(id);

        if(!p) return;

        p.value=value;

        this.revision++;

    }

    getParameter(id:string){

        return this.parameters.get(id)?.value;

    }

    rebuild(featureId:string){

        const plan=this.planner.createPlan(featureId);

        const optimized=this.optimizer.optimizePlan(plan);

        this.queue.enqueuePlan({

            ...plan,

            orderedFeatures:optimized.optimizedOrder

        });

        this.scheduler.start();
    }

    rebuildAll(){

        for(const feature of this.featureManager.features.values()){

            this.rebuild(feature.id);

        }

    }

    serialize(){

        return{

            revision:this.revision,

            parameters:Array.from(this.parameters.values())

        };

    }

    info(){

        return{

            engine:"BRepParametricModel",

            revision:this.revision,

            parameterCount:this.parameters.size

        };

    }

}