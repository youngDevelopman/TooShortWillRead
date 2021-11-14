using Microsoft.EntityFrameworkCore.Migrations;

namespace TooShortWillRead.DAL.Migrations
{
    public partial class AddDataSourceAwareness : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DataSourceId",
                table: "Articles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "InternalId",
                table: "Articles",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DataSource",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataSource", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "DataSource",
                columns: new[] { "Id", "Name" },
                values: new object[] { 1, "ManuallyCreated" });

            migrationBuilder.InsertData(
                table: "DataSource",
                columns: new[] { "Id", "Name" },
                values: new object[] { 2, "Wikipedia" });

            migrationBuilder.CreateIndex(
                name: "IX_Articles_DataSourceId_InternalId",
                table: "Articles",
                columns: new[] { "DataSourceId", "InternalId" },
                unique: true,
                filter: "[InternalId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_DataSource_Name",
                table: "DataSource",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Articles_DataSource_DataSourceId",
                table: "Articles",
                column: "DataSourceId",
                principalTable: "DataSource",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Articles_DataSource_DataSourceId",
                table: "Articles");

            migrationBuilder.DropTable(
                name: "DataSource");

            migrationBuilder.DropIndex(
                name: "IX_Articles_DataSourceId_InternalId",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "DataSourceId",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "InternalId",
                table: "Articles");
        }
    }
}
