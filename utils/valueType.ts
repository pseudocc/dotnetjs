module DotnetJs {
    export abstract class ValueType {
        public GetHashCode(refresh?: boolean): number {
            throw new NotImplementedExeption('ValueType.GetHashCode(boolean)');
        }
    }
}