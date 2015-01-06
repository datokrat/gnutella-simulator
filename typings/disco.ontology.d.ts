///<reference path="jaydata.d.ts" />

/*//////////////////////////////////////////////////////////////////////////////////////
////// Autogenerated by JaySvcUtil.exe http://JayData.org for more info        /////////
//////                      oData  V3  TypeScript                              /////////
//////////////////////////////////////////////////////////////////////////////////////*/


declare module Disco.Ontology {
    export class EntityBase extends $data.Entity {
        constructor();
        constructor(initData: { Id?: string; Key?: string; Modified?: Date; });
        Id: string;
        Key: string;
        Modified: Date;

    }

    export class Culture extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Code?: string; Name?: string; });
        Code: string;
        Name: string;

    }

    export class Region extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Code?: string; DescriptionId?: string; ParentId?: string; Description?: Disco.Ontology.Descriptor; Parent?: Disco.Ontology.Region; Partitions?: Disco.Ontology.Region[]; Posts?: Disco.Ontology.Post[]; });
        Code: string;
        DescriptionId: string;
        ParentId: string;
        Description: Disco.Ontology.Descriptor;
        Parent: Disco.Ontology.Region;
        Partitions: Disco.Ontology.Region[];
        Posts: Disco.Ontology.Post[];

    }

    export class Origin extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Uri?: string; DescriptionId?: string; Description?: Disco.Ontology.Descriptor; });
        Uri: string;
        DescriptionId: string;
        Description: Disco.Ontology.Descriptor;

    }

    export class Originator extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { AuthorId?: string; OriginId?: string; Author?: Disco.Ontology.User; Origin?: Disco.Ontology.Origin; });
        AuthorId: string;
        OriginId: string;
        Author: Disco.Ontology.User;
        Origin: Disco.Ontology.Origin;

    }

    export class Descriptor extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Name?: string; Description?: string; CultureId?: string; Culture?: Disco.Ontology.Culture; });
        Name: string;
        Description: string;
        CultureId: string;
        Culture: Disco.Ontology.Culture;

    }

    export class User extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Alias?: string; Token?: string; OriginId?: string; Origin?: Disco.Ontology.Origin; Memberships?: Disco.Ontology.GroupMembership[]; });
        Alias: string;
        Token: string;
        OriginId: string;
        Origin: Disco.Ontology.Origin;
        Memberships: Disco.Ontology.GroupMembership[];

    }

    export class Group extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Alias?: string; DescriptionId?: string; ParentId?: string; Description?: Disco.Ontology.Descriptor; Memberships?: Disco.Ontology.GroupMembership[]; Parent?: Disco.Ontology.Group; Partitions?: Disco.Ontology.Group[]; });
        Alias: string;
        DescriptionId: string;
        ParentId: string;
        Description: Disco.Ontology.Descriptor;
        Memberships: Disco.Ontology.GroupMembership[];
        Parent: Disco.Ontology.Group;
        Partitions: Disco.Ontology.Group[];

    }

    export class GroupMembership extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { MembershipTypeId?: string; User?: Disco.Ontology.User; Group?: Disco.Ontology.Group; MembershipType?: Disco.Ontology.GroupMembershipType; });
        MembershipTypeId: string;
        User: Disco.Ontology.User;
        Group: Disco.Ontology.Group;
        MembershipType: Disco.Ontology.GroupMembershipType;

    }

    export class GroupMembershipType extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { DescriptionId?: string; Description?: Disco.Ontology.Descriptor; });
        DescriptionId: string;
        Description: Disco.Ontology.Descriptor;

    }

    export class Post extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { PostTypeId?: string; ContentId?: string; PostType?: Disco.Ontology.PostType; Content?: Disco.Ontology.Content; Tags?: Disco.Ontology.Tag[]; Ratings?: Disco.Ontology.Rating[]; RefersTo?: Disco.Ontology.PostReference[]; ReferredFrom?: Disco.Ontology.PostReference[]; ModifiedBy?: Disco.Ontology.Originator; ChangeDetail?: Disco.Ontology.ChangeDetail; });
        PostTypeId: string;
        ContentId: string;
        PostType: Disco.Ontology.PostType;
        Content: Disco.Ontology.Content;
        Tags: Disco.Ontology.Tag[];
        Ratings: Disco.Ontology.Rating[];
        RefersTo: Disco.Ontology.PostReference[];
        ReferredFrom: Disco.Ontology.PostReference[];
        ModifiedBy: Disco.Ontology.Originator;
        ChangeDetail: Disco.Ontology.ChangeDetail;

    }

    export class PostReference extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { ReferrerId?: string; ReferreeId?: string; ReferenceTypeId?: string; Referrer?: Disco.Ontology.Post; Referree?: Disco.Ontology.Post; ReferenceType?: Disco.Ontology.PostReferenceType; });
        ReferrerId: string;
        ReferreeId: string;
        ReferenceTypeId: string;
        Referrer: Disco.Ontology.Post;
        Referree: Disco.Ontology.Post;
        ReferenceType: Disco.Ontology.PostReferenceType;

    }

    export class PostReferenceType extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { DescriptionId?: string; Description?: Disco.Ontology.Descriptor; });
        DescriptionId: string;
        Description: Disco.Ontology.Descriptor;

    }

    export class PostType extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { DescriptionId?: string; Description?: Disco.Ontology.Descriptor; });
        DescriptionId: string;
        Description: Disco.Ontology.Descriptor;

    }

    export class Tag extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { DescriptionId?: string; Description?: Disco.Ontology.Descriptor; Tagged?: Disco.Ontology.Post[]; Related?: Disco.Ontology.Tag[]; });
        DescriptionId: string;
        Description: Disco.Ontology.Descriptor;
        Tagged: Disco.Ontology.Post[];
        Related: Disco.Ontology.Tag[];

    }

    export class Rating extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Score?: number; PostId?: string; UserId?: string; User?: Disco.Ontology.User; Post?: Disco.Ontology.Post; ModifiedBy?: Disco.Ontology.Originator; ChangeDetail?: Disco.Ontology.ChangeDetail; });
        Score: number;
        PostId: string;
        UserId: string;
        User: Disco.Ontology.User;
        Post: Disco.Ontology.Post;
        ModifiedBy: Disco.Ontology.Originator;
        ChangeDetail: Disco.Ontology.ChangeDetail;

    }

    export class Content extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Title?: string; Text?: string; CultureId?: string; Culture?: Disco.Ontology.Culture; ModifiedBy?: Disco.Ontology.Originator; ChangeDetail?: Disco.Ontology.ChangeDetail; });
        Title: string;
        Text: string;
        CultureId: string;
        Culture: Disco.Ontology.Culture;
        ModifiedBy: Disco.Ontology.Originator;
        ChangeDetail: Disco.Ontology.ChangeDetail;

    }

    export class Changeset extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { ModifiedById?: string; ModifiedBy?: Disco.Ontology.Originator; Details?: Disco.Ontology.ChangeDetail[]; });
        ModifiedById: string;
        ModifiedBy: Disco.Ontology.Originator;
        Details: Disco.Ontology.ChangeDetail[];

    }

    export class ChangeDetail extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Action?: string; EntityName?: string; EntityKey?: string; OldValues?: string; NewValues?: string; ChangesetId?: string; Changeset?: Disco.Ontology.Changeset; });
        Action: string;
        EntityName: string;
        EntityKey: string;
        OldValues: string;
        NewValues: string;
        ChangesetId: string;
        Changeset: Disco.Ontology.Changeset;

    }

    export class NamedValueSet extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { OriginId?: string; Origin?: Disco.Ontology.Origin; Values?: Disco.Ontology.NamedValue[]; });
        OriginId: string;
        Origin: Disco.Ontology.Origin;
        Values: Disco.Ontology.NamedValue[];

    }

    export class NamedValue extends Disco.Ontology.EntityBase {
        constructor();
        constructor(initData: { Name?: string; Value?: string; NamedValueSetId?: string; NamedValueSet?: Disco.Ontology.NamedValueSet; });
        Name: string;
        Value: string;
        NamedValueSetId: string;
        NamedValueSet: Disco.Ontology.NamedValueSet;

    }

}

declare module Default {
    export class Container extends $data.EntityContext {
        onReady(): $data.IPromise<$data.EntityContext>;
        onReady(handler: (context: Container) => void): $data.IPromise<$data.EntityContext>;

        EntityBases: $data.EntitySet<Disco.Ontology.EntityBase>;
        Cultures: $data.EntitySet<Disco.Ontology.Culture>;
        Regions: $data.EntitySet<Disco.Ontology.Region>;
        Origins: $data.EntitySet<Disco.Ontology.Origin>;
        Originators: $data.EntitySet<Disco.Ontology.Originator>;
        Descriptors: $data.EntitySet<Disco.Ontology.Descriptor>;
        Users: $data.EntitySet<Disco.Ontology.User>;
        Groups: $data.EntitySet<Disco.Ontology.Group>;
        GroupMemberships: $data.EntitySet<Disco.Ontology.GroupMembership>;
        GroupMembershipTypes: $data.EntitySet<Disco.Ontology.GroupMembershipType>;
        Posts: $data.EntitySet<Disco.Ontology.Post>;
        PostReferences: $data.EntitySet<Disco.Ontology.PostReference>;
        PostReferenceTypes: $data.EntitySet<Disco.Ontology.PostReferenceType>;
        PostTypes: $data.EntitySet<Disco.Ontology.PostType>;
        Tags: $data.EntitySet<Disco.Ontology.Tag>;
        Ratings: $data.EntitySet<Disco.Ontology.Rating>;
        Content: $data.EntitySet<Disco.Ontology.Content>;
        Changesets: $data.EntitySet<Disco.Ontology.Changeset>;
        ChangeDetails: $data.EntitySet<Disco.Ontology.ChangeDetail>;
        NamedValueSets: $data.EntitySet<Disco.Ontology.NamedValueSet>;
        NamedValues: $data.EntitySet<Disco.Ontology.NamedValue>;

    }
}