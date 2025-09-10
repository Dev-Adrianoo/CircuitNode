export interface NodeComponent {
    id: string;
    type: string;
    name: string;
    properties?: any;

}
export interface CircuitMappingData {
    components: NodeComponent[];
    board: string;

}

export interface CompilerResult {
    success: boolean;
    data: string;
    generatedCode: string;
}