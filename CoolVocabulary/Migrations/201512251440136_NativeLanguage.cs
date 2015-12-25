namespace CoolVocabulary.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NativeLanguage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "NativeLanguage", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "NativeLanguage");
        }
    }
}
