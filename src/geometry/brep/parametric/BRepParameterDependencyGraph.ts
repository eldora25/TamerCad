export class BRepParameterDependencyGraph {

    private forward = new Map<string, Set<string>>();
    private reverse = new Map<string, Set<string>>();

    addDependency(source:string,target:string):void{

        if(!this.forward.has(source)){
            this.forward.set(source,new Set());
        }

        if(!this.reverse.has(target)){
            this.reverse.set(target,new Set());
        }

        this.forward.get(source)!.add(target);
        this.reverse.get(target)!.add(source);
    }

    removeDependency(source:string,target:string):void{

        this.forward.get(source)?.delete(target);
        this.reverse.get(target)?.delete(source);
    }

    clear():void{

        this.forward.clear();
        this.reverse.clear();
    }

    dependenciesOf(parameter:string):string[]{

        return Array.from(
            this.forward.get(parameter) ?? []
        );
    }

    dependentsOf(parameter:string):string[]{

        return Array.from(
            this.reverse.get(parameter) ?? []
        );
    }

    topologicalOrder():string[]{

        const indegree=new Map<string,number>();

        for(const node of this.forward.keys()){
            indegree.set(node,0);
        }

        for(const edges of this.forward.values()){
            for(const edge of edges){
                indegree.set(
                    edge,
                    (indegree.get(edge) ?? 0)+1
                );
            }
        }

        const queue:string[]=[];

        for(const [node,deg] of indegree){

            if(deg===0){

                queue.push(node);

            }

        }

        const result:string[]=[];

        while(queue.length){

            const node=queue.shift()!;

            result.push(node);

            for(const next of this.forward.get(node) ?? []){

                const value=(indegree.get(next) ?? 0)-1;

                indegree.set(next,value);

                if(value===0){

                    queue.push(next);

                }

            }

        }

        return result;
    }

    detectCycles():string[][]{

        const cycles:string[][]=[];
        const visiting=new Set<string>();
        const visited=new Set<string>();

        const dfs=(node:string,path:string[])=>{

            if(visiting.has(node)){
                cycles.push([...path,node]);
                return;
            }

            if(visited.has(node)){
                return;
            }

            visiting.add(node);

            for(const next of this.forward.get(node) ?? []){

                dfs(next,[...path,node]);

            }

            visiting.delete(node);
            visited.add(node);

        };

        for(const node of this.forward.keys()){

            dfs(node,[]);

        }

        return cycles;
    }

    affectedParameters(parameter:string):string[]{

        const affected=new Set<string>();

        const visit=(id:string)=>{

            for(const child of this.forward.get(id) ?? []){

                if(!affected.has(child)){

                    affected.add(child);

                    visit(child);

                }

            }

        };

        visit(parameter);

        return Array.from(affected);
    }

    info(){

        return{

            engine:"BRepParameterDependencyGraph",

            nodes:this.forward.size,

            edges:
                Array.from(this.forward.values())
                .reduce(
                    (sum,e)=>sum+e.size,
                    0
                )

        };

    }

}