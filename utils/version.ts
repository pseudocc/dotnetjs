module DotnetJs {
    export class Version implements ICloneable, IComparable<Version>, IEquatable<Version> {
        private major: number;
        private minor: number;
        private build: number;
        private revision: number;

        constructor(major?: number, minor?: number, build?: number, revision?: number) {
            this.Major = major || 1;
            this.Minor = minor || 0;
            this.Build = build;
            this.Revision = revision;
        }

        public get Major(): number {
            return this.major;
        }

        public set Major(value: number) {
            if (value == null)
                throw new ArgumentNullException('major');
            if (value < 0)
                throw new ArgumentOutOfRangeException('below zero');
            this.major = value;
        }

        public get Minor(): number {
            return this.minor;
        }

        public set Minor(value: number) {
            if (value == null)
                throw new ArgumentNullException('major');
            if (value < 0)
                throw new ArgumentOutOfRangeException('below zero');
            this.minor = value;
        }

        public get Build(): number {
            return this.build;
        }

        public set Build(value: number) {
            if (value < 0)
                throw new ArgumentOutOfRangeException('below zero');
            this.build = value;
        }

        public get Revision(): number {
            if (this.build == null)
                return null;
            return this.revision;
        }

        public set Revision(value: number) {
            if (value < 0)
                throw new ArgumentOutOfRangeException('below zero');
            this.revision = value;
        }

        public Clone(): Version {
            return new Version(this.major, this.minor, this.build, this.revision);
        }

        public CompareTo(obj: Version): number {
            if (this.major > obj.major)
                return 1;
            if (this.major < obj.major)
                return -1;

            if (this.minor > obj.minor)
                return 1;
            if (this.minor < obj.minor)
                return -1;

            if (this.build || 0 > obj.build || 0)
                return 1;
            if (this.build || 0 < obj.build || 0)
                return -1;

            if (this.revision || 0 > obj.revision || 0)
                return 1;
            if (this.revision || 0 < obj.revision || 0)
                return -1;

            return 0;
        }

        public Equals(obj: Version): boolean {
            return this.CompareTo(obj) == 0;
        }

        public toString(): string {
            var result = this.major.toString();
            result += '.' + this.minor;
            if (this.build != null) {
                result += '.' + this.build;
                if (this.revision != null) {
                    result += '.' + this.revision;
                }
            }
            return result;
        }
    }
}