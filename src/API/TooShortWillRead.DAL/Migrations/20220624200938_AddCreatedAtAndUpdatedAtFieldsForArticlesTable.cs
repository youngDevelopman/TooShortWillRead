using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TooShortWillRead.DAL.Migrations
{
    public partial class AddCreatedAtAndUpdatedAtFieldsForArticlesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Articles",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "getutcdate()");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Articles",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "getutcdate()");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Articles");
        }
    }
}
