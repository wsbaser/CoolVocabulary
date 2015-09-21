namespace CoolVocabulary.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SpeachPart : DbMigration
    {
        public override void Up() {
            AddColumn("dbo.Translations", "SpeachPart", c => c.Int(nullable: false, defaultValue: 1));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Translations", "SpeachPart");
        }
    }
}
