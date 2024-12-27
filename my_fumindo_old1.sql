--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset (
    asset_id integer NOT NULL,
    branch_id integer NOT NULL,
    asset_name character varying(100) NOT NULL,
    category character varying(5) NOT NULL,
    tool_category character varying(30),
    tool_condition character varying(15),
    unit character varying(10),
    initial_stock integer,
    current_stock integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.asset OWNER TO postgres;

--
-- Name: asset_change_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_change_log (
    asset_log_id integer NOT NULL,
    asset_id integer,
    user_id integer,
    column_name character varying(100),
    value_before text,
    value_after text,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    operation character varying(100)
);


ALTER TABLE public.asset_change_log OWNER TO postgres;

--
-- Name: asset_change_log_table_asset_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_change_log_table_asset_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_change_log_table_asset_log_id_seq OWNER TO postgres;

--
-- Name: asset_change_log_table_asset_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_change_log_table_asset_log_id_seq OWNED BY public.asset_change_log.asset_log_id;


--
-- Name: asset_loan_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_loan_table (
    asset_loan_id integer NOT NULL,
    loan_id integer NOT NULL,
    asset_id integer NOT NULL,
    input_method character varying(10),
    quantity smallint NOT NULL
);


ALTER TABLE public.asset_loan_table OWNER TO postgres;

--
-- Name: asset_loan_table_asset_loan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_loan_table_asset_loan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_loan_table_asset_loan_id_seq OWNER TO postgres;

--
-- Name: asset_loan_table_asset_loan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_loan_table_asset_loan_id_seq OWNED BY public.asset_loan_table.asset_loan_id;


--
-- Name: asset_return_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_return_table (
    asset_return_id integer NOT NULL,
    return_id integer NOT NULL,
    asset_id integer NOT NULL,
    quantity smallint NOT NULL,
    condition character varying(20) NOT NULL
);


ALTER TABLE public.asset_return_table OWNER TO postgres;

--
-- Name: asset_return_table_asset_return_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_return_table_asset_return_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_return_table_asset_return_id_seq OWNER TO postgres;

--
-- Name: asset_return_table_asset_return_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_return_table_asset_return_id_seq OWNED BY public.asset_return_table.asset_return_id;


--
-- Name: asset_table_asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_table_asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_table_asset_id_seq OWNER TO postgres;

--
-- Name: asset_table_asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_table_asset_id_seq OWNED BY public.asset.asset_id;


--
-- Name: blacklist_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blacklist_tokens (
    id_blacklist_token integer NOT NULL,
    token text NOT NULL,
    expired_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.blacklist_tokens OWNER TO postgres;

--
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blacklist_tokens_id_blacklist_token_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blacklist_tokens_id_blacklist_token_seq OWNER TO postgres;

--
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blacklist_tokens_id_blacklist_token_seq OWNED BY public.blacklist_tokens.id_blacklist_token;


--
-- Name: branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch (
    branch_id integer NOT NULL,
    branch_name character varying(100) NOT NULL,
    address text NOT NULL
);


ALTER TABLE public.branch OWNER TO postgres;

--
-- Name: branch_table_branch_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branch_table_branch_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_table_branch_id_seq1 OWNER TO postgres;

--
-- Name: branch_table_branch_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branch_table_branch_id_seq1 OWNED BY public.branch.branch_id;


--
-- Name: customer_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_table (
    customer_id integer NOT NULL,
    customer_name character varying(100) NOT NULL,
    address text NOT NULL,
    phone_number bigint,
    email character varying
);


ALTER TABLE public.customer_table OWNER TO postgres;

--
-- Name: customer_table_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_table_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_table_customer_id_seq OWNER TO postgres;

--
-- Name: customer_table_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_table_customer_id_seq OWNED BY public.customer_table.customer_id;


--
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    employee_id integer NOT NULL,
    branch_id smallint NOT NULL,
    fullname character varying(100) NOT NULL,
    phone_number character varying(15),
    email character varying(150),
    address text,
    status character varying(30) NOT NULL,
    division character varying(100)
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- Name: form_fields_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_fields_table (
    field_id integer NOT NULL,
    form_id smallint NOT NULL,
    field_name character varying(50) NOT NULL,
    field_type character varying(50) NOT NULL,
    options jsonb,
    is_required boolean DEFAULT false NOT NULL,
    "position" smallint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.form_fields_table OWNER TO postgres;

--
-- Name: form_fields_table_field_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.form_fields_table_field_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_fields_table_field_id_seq OWNER TO postgres;

--
-- Name: form_fields_table_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.form_fields_table_field_id_seq OWNED BY public.form_fields_table.field_id;


--
-- Name: form_response_values_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_response_values_table (
    value_id integer NOT NULL,
    response_id integer NOT NULL,
    field_id smallint NOT NULL,
    field_value text
);


ALTER TABLE public.form_response_values_table OWNER TO postgres;

--
-- Name: form_response_values_table_value_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.form_response_values_table_value_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_response_values_table_value_id_seq OWNER TO postgres;

--
-- Name: form_response_values_table_value_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.form_response_values_table_value_id_seq OWNED BY public.form_response_values_table.value_id;


--
-- Name: form_responses_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_responses_table (
    response_id integer NOT NULL,
    form_id smallint NOT NULL,
    staff_id smallint NOT NULL,
    submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.form_responses_table OWNER TO postgres;

--
-- Name: form_responses_response_id _seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."form_responses_response_id _seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."form_responses_response_id _seq" OWNER TO postgres;

--
-- Name: form_responses_response_id _seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."form_responses_response_id _seq" OWNED BY public.form_responses_table.response_id;


--
-- Name: form_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_table (
    form_id integer NOT NULL,
    form_title character varying(100) NOT NULL,
    submit_in_zone boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.form_table OWNER TO postgres;

--
-- Name: form_table_form_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.form_table_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_table_form_id_seq OWNER TO postgres;

--
-- Name: form_table_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.form_table_form_id_seq OWNED BY public.form_table.form_id;


--
-- Name: loan_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan_table (
    loan_id integer NOT NULL,
    staff_id smallint NOT NULL,
    notes text,
    loan_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.loan_table OWNER TO postgres;

--
-- Name: loan_table_loan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loan_table_loan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loan_table_loan_id_seq OWNER TO postgres;

--
-- Name: loan_table_loan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loan_table_loan_id_seq OWNED BY public.loan_table.loan_id;


--
-- Name: return_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_table (
    return_id integer NOT NULL,
    loan_id integer NOT NULL,
    notes text,
    return_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.return_table OWNER TO postgres;

--
-- Name: return_table_return_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_table_return_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.return_table_return_id_seq OWNER TO postgres;

--
-- Name: return_table_return_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_table_return_id_seq OWNED BY public.return_table.return_id;


--
-- Name: staff_table_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_table_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_table_staff_id_seq OWNER TO postgres;

--
-- Name: staff_table_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_table_staff_id_seq OWNED BY public.employee.employee_id;


--
-- Name: task_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_table (
    task_id integer NOT NULL,
    loan_id integer NOT NULL,
    staff_id smallint NOT NULL,
    form_id smallint NOT NULL,
    customer_id integer,
    task_title character varying(100),
    task_address text,
    radius smallint,
    task_start_date timestamp with time zone,
    task_until_date timestamp with time zone
);


ALTER TABLE public.task_table OWNER TO postgres;

--
-- Name: task_table_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_table_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_table_task_id_seq OWNER TO postgres;

--
-- Name: task_table_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_table_task_id_seq OWNED BY public.task_table.task_id;


--
-- Name: tool_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool_category (
    tool_category_id integer NOT NULL,
    tool_category_name character varying(255) NOT NULL
);


ALTER TABLE public.tool_category OWNER TO postgres;

--
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tool_category_tool_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tool_category_tool_category_id_seq OWNER TO postgres;

--
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_category_tool_category_id_seq OWNED BY public.tool_category.tool_category_id;


--
-- Name: tool_condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool_condition (
    tool_condition_id integer NOT NULL,
    tool_condition_name character varying(255) NOT NULL
);


ALTER TABLE public.tool_condition OWNER TO postgres;

--
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tool_condition_tool_condition_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tool_condition_tool_condition_id_seq OWNER TO postgres;

--
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_condition_tool_condition_id_seq OWNED BY public.tool_condition.tool_condition_id;


--
-- Name: tracking_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracking_table (
    "tracking_id " integer NOT NULL,
    task_id integer NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    submit_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tracking_table OWNER TO postgres;

--
-- Name: tracking_table_tracking_id _seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."tracking_table_tracking_id _seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."tracking_table_tracking_id _seq" OWNER TO postgres;

--
-- Name: tracking_table_tracking_id _seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."tracking_table_tracking_id _seq" OWNED BY public.tracking_table."tracking_id ";


--
-- Name: unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit (
    unit_id integer NOT NULL,
    unit_name character varying(255) NOT NULL
);


ALTER TABLE public.unit OWNER TO postgres;

--
-- Name: unit_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unit_unit_id_seq OWNER TO postgres;

--
-- Name: unit_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_unit_id_seq OWNED BY public.unit.unit_id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    employee_id smallint,
    username character varying(15),
    password character varying(255),
    type_user character varying(30),
    role character varying(30)
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_user_id_seq OWNER TO postgres;

--
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- Name: asset asset_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset ALTER COLUMN asset_id SET DEFAULT nextval('public.asset_table_asset_id_seq'::regclass);


--
-- Name: asset_change_log asset_log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log ALTER COLUMN asset_log_id SET DEFAULT nextval('public.asset_change_log_table_asset_log_id_seq'::regclass);


--
-- Name: asset_loan_table asset_loan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_loan_table ALTER COLUMN asset_loan_id SET DEFAULT nextval('public.asset_loan_table_asset_loan_id_seq'::regclass);


--
-- Name: asset_return_table asset_return_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_return_table ALTER COLUMN asset_return_id SET DEFAULT nextval('public.asset_return_table_asset_return_id_seq'::regclass);


--
-- Name: blacklist_tokens id_blacklist_token; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blacklist_tokens ALTER COLUMN id_blacklist_token SET DEFAULT nextval('public.blacklist_tokens_id_blacklist_token_seq'::regclass);


--
-- Name: branch branch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch ALTER COLUMN branch_id SET DEFAULT nextval('public.branch_table_branch_id_seq1'::regclass);


--
-- Name: customer_table customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_table ALTER COLUMN customer_id SET DEFAULT nextval('public.customer_table_customer_id_seq'::regclass);


--
-- Name: employee employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee ALTER COLUMN employee_id SET DEFAULT nextval('public.staff_table_staff_id_seq'::regclass);


--
-- Name: form_fields_table field_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_fields_table ALTER COLUMN field_id SET DEFAULT nextval('public.form_fields_table_field_id_seq'::regclass);


--
-- Name: form_response_values_table value_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_response_values_table ALTER COLUMN value_id SET DEFAULT nextval('public.form_response_values_table_value_id_seq'::regclass);


--
-- Name: form_responses_table response_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_responses_table ALTER COLUMN response_id SET DEFAULT nextval('public."form_responses_response_id _seq"'::regclass);


--
-- Name: form_table form_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_table ALTER COLUMN form_id SET DEFAULT nextval('public.form_table_form_id_seq'::regclass);


--
-- Name: loan_table loan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_table ALTER COLUMN loan_id SET DEFAULT nextval('public.loan_table_loan_id_seq'::regclass);


--
-- Name: return_table return_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_table ALTER COLUMN return_id SET DEFAULT nextval('public.return_table_return_id_seq'::regclass);


--
-- Name: task_table task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_table ALTER COLUMN task_id SET DEFAULT nextval('public.task_table_task_id_seq'::regclass);


--
-- Name: tool_category tool_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_category ALTER COLUMN tool_category_id SET DEFAULT nextval('public.tool_category_tool_category_id_seq'::regclass);


--
-- Name: tool_condition tool_condition_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_condition ALTER COLUMN tool_condition_id SET DEFAULT nextval('public.tool_condition_tool_condition_id_seq'::regclass);


--
-- Name: tracking_table tracking_id ; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_table ALTER COLUMN "tracking_id " SET DEFAULT nextval('public."tracking_table_tracking_id _seq"'::regclass);


--
-- Name: unit unit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit ALTER COLUMN unit_id SET DEFAULT nextval('public.unit_unit_id_seq'::regclass);


--
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- Data for Name: asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset (asset_id, branch_id, asset_name, category, tool_category, tool_condition, unit, initial_stock, current_stock, created_at, updated_at) FROM stdin;
38	1	Coba alat fumigasi	Alat	Peralatan Fumigasi	Baik	UNIT	4	3	2024-11-28 13:41:24.567318+07	2024-11-28 13:41:24.567318+07
3	2	Fogging IGEBA TF-35	Alat	Peralatan Fumigasi	Cukup	\N	\N	\N	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
4	2	Draeger X-am 5600	Alat	Alat Ukut Fumigasi	Rusak	\N	\N	\N	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
5	1	Koil Pemanas	Bahan	\N	\N	PCS	20	15	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
6	1	Klem Selang 12mm	Bahan	\N	\N	PCS	30	15	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
7	2	Sarung Tangan Katun	Bahan	\N	\N	PCS	24	12	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
8	2	Selang Nylon Distribusi	Bahan	\N	\N	M	25	13	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
9	1	Refill Tabung SCBA	Bahan	\N	\N	PCS	26	13	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
10	1	Kantong Sand Snake	Bahan	\N	\N	PCS	30	15	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
2	1	Fogging Tasco KN 15	Alat	Peralatan Fumigasi	Baik	\N	\N	\N	2024-11-11 14:06:12.451563+07	2024-11-11 14:06:12.451563+07
\.


--
-- Data for Name: asset_change_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_change_log (asset_log_id, asset_id, user_id, column_name, value_before, value_after, updated_at, operation) FROM stdin;
10	2	1	asset_name	Fogging Tasco KN	Fogging Tasco KN 15	2024-11-11 16:39:53.077314+07	\N
267	38	\N	asset_id	38	\N	2024-11-28 13:41:24.581585+07	Tambah
268	38	\N	branch_id	2	2	2024-11-28 13:41:24.584209+07	Tambah
269	38	\N	asset_name	Coba alat1	Coba alat1	2024-11-28 13:41:24.586051+07	Tambah
270	38	\N	category	Alat	Alat	2024-11-28 13:41:24.5877+07	Tambah
271	38	\N	tool_category	Peralatan Fumigasi	Peralatan Fumigasi	2024-11-28 13:41:24.590071+07	Tambah
272	38	\N	tool_condition	Cukup	Cukup	2024-11-28 13:41:24.594183+07	Tambah
273	38	\N	unit	BAG	BAG	2024-11-28 13:41:24.597132+07	Tambah
274	38	\N	initial_stock	12	12	2024-11-28 13:41:24.598952+07	Tambah
275	38	\N	current_stock	11	11	2024-11-28 13:41:24.600369+07	Tambah
284	38	\N	category	Alat	Bahan	2024-11-28 13:42:29.080566+07	Edit
285	38	\N	tool_category	Peralatan Fumigasi		2024-11-28 13:42:29.084203+07	Edit
286	38	\N	tool_condition	Cukup		2024-11-28 13:42:29.086387+07	Edit
290	38	\N	branch_id	2	1	2024-11-28 15:58:45.465259+07	Edit
291	38	\N	asset_name	Coba alat1	Coba alat fumigasi	2024-11-28 15:58:45.470572+07	Edit
292	38	\N	category	Bahan	Alat	2024-11-28 15:58:45.473364+07	Edit
293	38	\N	tool_category		Peralatan Fumigasi	2024-11-28 15:58:45.475737+07	Edit
294	38	\N	tool_condition		Baik	2024-11-28 15:58:45.47837+07	Edit
295	38	\N	unit	BAG	UNIT	2024-11-28 15:58:45.480566+07	Edit
296	38	\N	initial_stock	12	4	2024-11-28 15:58:45.482465+07	Edit
297	38	\N	current_stock	11	3	2024-11-28 15:58:45.485419+07	Edit
\.


--
-- Data for Name: asset_loan_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_loan_table (asset_loan_id, loan_id, asset_id, input_method, quantity) FROM stdin;
8	7	2	Scan	2
9	7	3	Scan	3
10	7	4	Manual	4
12	7	5	\N	3
\.


--
-- Data for Name: asset_return_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_return_table (asset_return_id, return_id, asset_id, quantity, condition) FROM stdin;
12	5	2	2	Baik
13	5	3	2	Kurang
14	5	4	2	Cukup
15	5	5	2	Rusak
\.


--
-- Data for Name: blacklist_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blacklist_tokens (id_blacklist_token, token, expired_at, created_at) FROM stdin;
\.


--
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch (branch_id, branch_name, address) FROM stdin;
1	Fumindo Karawang	Jl.Raya Kopel Kp. Kelapa Nunggal RT. 027 RW. 007 Desa Gintung Kerta, Karawang, 41371\nJawa Barat - Indonesia
2	Fumindo Surabaya	Jl. Margomulyo 51 A, No. 41, Greges, Kec. Asemrowo, Surabaya, 60183\nJawa Timur - Indonesia
\.


--
-- Data for Name: customer_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_table (customer_id, customer_name, address, phone_number, email) FROM stdin;
1	PT. Pindad Persero	Jl. Panglima Sudirman No.1, Dusun Sedayu, Turen, Kec. Turen, Kabupaten Malang, Jawa Timur 65175	85233344499	pindadindo@gmail.com
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (employee_id, branch_id, fullname, phone_number, email, address, status, division) FROM stdin;
46	2	Aisyah	83256456767	aisyah@gmail.com	Jl Temanggung Tilung	Online	Admin
88	2	Siri	08218989785	siri2525@gmail.com	Jl. Rajawali 12	Offline	Technician Manager
95	2	Yoggy	085234345656	yoggy@gmail.com	Jl. Rajawali	Online	\N
80	1	Alam	082345456767	alam@gmail.com	Jl. Kandangan 5	Offline	Admin
79	1	Salim				Survey	Technician and Operational
77	1	Riko				Survey	Technician and Operational
75	2	Mana	082345673434	mana@gmail.com	Jl. Sisinga	Survey	Technician and Operational
74	1	Agus	085234563488	agus@gmail.com	Jl Tilung	Offline	Admin
72	2	Tira	082123452345	tira@gmail.com	Jl, Kandangan Jaya	Offline	Technician and Operational
5	2	Chandra Tirta	89692863233	chandratiryansyah@gmail.com	Jl. Kandangan Jaya V	Online	Admin
4	1	Apri	85223345333	apri234@gmail.com	Jl. Manukan Lor No.3 5M No, Banjar Sugihan, Kec. Tandes, Surabaya, Jawa Timur 60185	On Duty	Service Technician 
1	1	Ahmadi	85252456788	ahmadi2525@gmail.com	Jl. Manukan Tengah No.20, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185	Offline	Technician and Operational
\.


--
-- Data for Name: form_fields_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_fields_table (field_id, form_id, field_name, field_type, options, is_required, "position", created_at, updated_at) FROM stdin;
1	1	Jenis Fumigasi	dropdown	["Bangunan", "Container", "Silo"]	t	1	2024-11-08 17:33:12.055077+07	2024-11-08 17:33:12.055077+07
2	1	Ukuran Container	radiobutton	["20’", "40’", "40’HC"]	t	2	2024-11-08 17:33:12.055077+07	2024-11-08 17:33:12.055077+07
3	1	Jenis Container	radiobutton	["GP", "Open Top"]	t	3	2024-11-08 17:33:12.055077+07	2024-11-08 17:33:12.055077+07
4	1	Dosis Fumigasi	textfield	\N	f	4	2024-11-08 17:33:12.055077+07	2024-11-08 17:33:12.055077+07
5	1	Foto Tabung	image	\N	f	5	2024-11-08 17:33:12.055077+07	2024-11-08 17:33:12.055077+07
6	1	No Container/Catatan Lainnya	textarea	\N	f	6	2024-11-08 17:33:12.055077+07	2024-11-08 17:33:12.055077+07
27	6	Container	list	["No Container", "Tujuan"]	t	1	2024-11-11 17:00:48.786647+07	2024-11-11 17:00:48.786647+07
28	6	Volume Container	textfield	\N	t	2	2024-11-11 17:02:22.457296+07	2024-11-11 17:02:22.457296+07
29	6	Ukuran dosis yang ditentukan	textfield	\N	t	3	2024-11-11 17:03:20.304948+07	2024-11-11 17:03:20.304948+07
30	6	Waktu pemaparan	textfield	\N	t	4	2024-11-11 17:04:02.935597+07	2024-11-11 17:04:02.935597+07
31	6	Prakiraan suhu minimum	textfield	\N	t	5	2024-11-11 17:04:39.101922+07	2024-11-11 17:04:39.101922+07
32	6	Catatan	textarea	\N	f	6	2024-11-11 17:05:04.991631+07	2024-11-11 17:05:04.991631+07
\.


--
-- Data for Name: form_response_values_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_response_values_table (value_id, response_id, field_id, field_value) FROM stdin;
91	17	1	Container
92	17	2	40’
93	17	3	GP
94	17	4	48 gram/m³
95	17	5	["foto_tabung_1.jpg", "foto_tabung_2.jpg"]
96	17	6	Catatan Lainnya: Kontainer di-sungkup penuh dan dilakukan pengawasan ketat selama 24 jam masa pemaparan.
\.


--
-- Data for Name: form_responses_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_responses_table (response_id, form_id, staff_id, submitted_at) FROM stdin;
17	1	1	2024-11-11 09:49:00.490297+07
\.


--
-- Data for Name: form_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_table (form_id, form_title, submit_in_zone, is_default, created_at, updated_at) FROM stdin;
6	Fumigation Record Sheet	f	f	2024-11-11 16:55:37.013612+07	2024-11-11 16:55:37.013612+07
1	Service Report	t	t	2024-11-08 17:22:00.055077+07	2024-11-08 17:22:00.055077+07
7	Usage methyl bromide report 	f	f	2024-11-11 16:56:06.042223+07	2024-11-11 16:56:06.042223+07
\.


--
-- Data for Name: loan_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_table (loan_id, staff_id, notes, loan_date) FROM stdin;
7	1	\N	2024-11-11 13:10:37.741015+07
\.


--
-- Data for Name: return_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_table (return_id, loan_id, notes, return_date) FROM stdin;
5	7	Pengembalian sebagian alat dan bahan	2024-11-11 14:45:05.399093+07
\.


--
-- Data for Name: task_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_table (task_id, loan_id, staff_id, form_id, customer_id, task_title, task_address, radius, task_start_date, task_until_date) FROM stdin;
18	7	1	1	1	Fumigasi MB	Jl. Panglima Sudirman No.1, Dusun Sedayu, Turen, Kec. Turen, Kabupaten Malang, Jawa Timur 65175	150	2024-11-11 08:00:00.12601+07	2024-12-11 23:00:00.12601+07
\.


--
-- Data for Name: tool_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool_category (tool_category_id, tool_category_name) FROM stdin;
\.


--
-- Data for Name: tool_condition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool_condition (tool_condition_id, tool_condition_name) FROM stdin;
\.


--
-- Data for Name: tracking_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tracking_table ("tracking_id ", task_id, latitude, longitude, submit_at) FROM stdin;
9	18	-7.256999	112.668600	2024-11-12 08:20:42.742862+07
7	18	-7.258851	112.667785	2024-11-12 08:20:02.12601+07
10	18	-7.257935	112.672420	2024-11-12 08:21:18.889565+07
13	18	-7.258255	112.676411	2024-11-12 08:21:55.137452+07
14	18	-7.258382	112.679072	2024-11-12 08:22:58.767906+07
19	18	-7.240949	112.682205	2024-11-12 08:24:08.300214+07
15	18	-7.257446	112.680316	2024-11-12 08:23:20+07
16	18	-7.251954	112.681904	2024-11-12 08:23:58.767906+07
20	18	-7.234349	112.682396	2024-11-12 08:24:28.300214+07
\.


--
-- Data for Name: unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit (unit_id, unit_name) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (user_id, employee_id, username, password, type_user, role) FROM stdin;
92	95	yoggy2525	$2a$10$L.T4Hq2ZKu5DP4LresqJ9e1bBl43gCqDHT1XNeTsOXPZefFtWRAyO	Employee	Admin
1	1	ahmadi2525	$2a$10$JCgP3CqJtUIZ7L4MqLxvb.cvOniKYdNGCMhptd76KTMv5f9XVD8hi	Employee	Petugas Lapangan
2	4	apri2525	$2a$10$qgOdB0Xshv5VL1F6/s92BuK1e/eZ.JDglP9w/wmwRtuKQoUTdgCBO	Employee	Petugas Lapangan
3	5	chandra2525	$2a$10$awuUx2Io/rN04CptWiMQYufurrAfly82gi3ZNxzA/Gs7dcJD5niqm	Employee	Manajer Teknis
20	72	tira2525	$2a$10$sEsGRZzM2r6Di3vL708Hh.s2DNvrZbWPBFRFqp57dSyvGgxUiJ6KW	Employee	Admin
67	46	syah252525	$2a$10$JIAphD1GYRWMa32b36PqBu6hkbmdc5b1z29ocGQ9dfl1YEJYjfwJm	\N	Admin
69	75	mana2525	$2a$10$DSLcXOvUxGF7YnpyVCBamO1LPBWVL5MAhzDiDaoFglVfW9A0neVI2	Employee	Admin
70	\N	wahyu2552	$2a$10$TcaAvhqrqMq6YMdp5OknYuVHt0QtOKzJPkddcaDoP0/lV9UI8lv5y	\N	Petugas Lapangan
73	80	alam2525	$2a$10$FMOPMuyhER5wcQu34I.UperUfgN2.h4WmZIMwDHmsFWy4chcgPEpa	Employee	Petugas Lapangan
76	88	siri2525	$2a$10$EtziITIEZeY9pY0LfUehG.cgefgknZqZSDm1OY8bzZVsaC9gCoiP.	Employee	Admin
\.


--
-- Name: asset_change_log_table_asset_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_change_log_table_asset_log_id_seq', 297, true);


--
-- Name: asset_loan_table_asset_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_loan_table_asset_loan_id_seq', 12, true);


--
-- Name: asset_return_table_asset_return_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_return_table_asset_return_id_seq', 15, true);


--
-- Name: asset_table_asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_table_asset_id_seq', 38, true);


--
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blacklist_tokens_id_blacklist_token_seq', 64, true);


--
-- Name: branch_table_branch_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branch_table_branch_id_seq1', 159, true);


--
-- Name: customer_table_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_table_customer_id_seq', 1, true);


--
-- Name: form_fields_table_field_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.form_fields_table_field_id_seq', 32, true);


--
-- Name: form_response_values_table_value_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.form_response_values_table_value_id_seq', 102, true);


--
-- Name: form_responses_response_id _seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."form_responses_response_id _seq"', 28, true);


--
-- Name: form_table_form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.form_table_form_id_seq', 7, true);


--
-- Name: loan_table_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_table_loan_id_seq', 13, true);


--
-- Name: return_table_return_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_table_return_id_seq', 5, true);


--
-- Name: staff_table_staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_table_staff_id_seq', 95, true);


--
-- Name: task_table_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_table_task_id_seq', 18, true);


--
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_category_tool_category_id_seq', 1, false);


--
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_condition_tool_condition_id_seq', 1, false);


--
-- Name: tracking_table_tracking_id _seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."tracking_table_tracking_id _seq"', 20, true);


--
-- Name: unit_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_unit_id_seq', 1, false);


--
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 92, true);


--
-- Name: asset_change_log asset_change_log_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log
    ADD CONSTRAINT asset_change_log_table_pkey PRIMARY KEY (asset_log_id);


--
-- Name: asset_loan_table asset_loan_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_loan_table
    ADD CONSTRAINT asset_loan_table_pkey PRIMARY KEY (asset_loan_id);


--
-- Name: asset_return_table asset_return_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_return_table
    ADD CONSTRAINT asset_return_table_pkey PRIMARY KEY (asset_return_id);


--
-- Name: asset asset_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_table_pkey PRIMARY KEY (asset_id);


--
-- Name: blacklist_tokens blacklist_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blacklist_tokens
    ADD CONSTRAINT blacklist_tokens_pkey PRIMARY KEY (id_blacklist_token);


--
-- Name: branch branch_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_table_pkey PRIMARY KEY (branch_id);


--
-- Name: customer_table customer_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_table
    ADD CONSTRAINT customer_table_pkey PRIMARY KEY (customer_id);


--
-- Name: form_fields_table form_fields_table_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_fields_table
    ADD CONSTRAINT form_fields_table_pkey1 PRIMARY KEY (field_id);


--
-- Name: form_response_values_table form_response_values_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_response_values_table
    ADD CONSTRAINT form_response_values_table_pkey PRIMARY KEY (value_id);


--
-- Name: form_responses_table form_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_responses_table
    ADD CONSTRAINT form_responses_pkey PRIMARY KEY (response_id);


--
-- Name: form_table form_table_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_table
    ADD CONSTRAINT form_table_pkey1 PRIMARY KEY (form_id);


--
-- Name: loan_table loan_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_table
    ADD CONSTRAINT loan_table_pkey PRIMARY KEY (loan_id);


--
-- Name: return_table return_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_table
    ADD CONSTRAINT return_table_pkey PRIMARY KEY (return_id);


--
-- Name: employee staff_table_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT staff_table_pkey1 PRIMARY KEY (employee_id);


--
-- Name: task_table task_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_table
    ADD CONSTRAINT task_table_pkey PRIMARY KEY (task_id);


--
-- Name: tool_category tool_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_category
    ADD CONSTRAINT tool_category_pkey PRIMARY KEY (tool_category_id);


--
-- Name: tool_condition tool_condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_condition
    ADD CONSTRAINT tool_condition_pkey PRIMARY KEY (tool_condition_id);


--
-- Name: tracking_table tracking_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_table
    ADD CONSTRAINT tracking_table_pkey PRIMARY KEY ("tracking_id ");


--
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (unit_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: asset_loan_table f_key_asset_loan_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_loan_table
    ADD CONSTRAINT f_key_asset_loan_1 FOREIGN KEY (loan_id) REFERENCES public.loan_table(loan_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: asset_loan_table f_key_asset_loan_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_loan_table
    ADD CONSTRAINT f_key_asset_loan_2 FOREIGN KEY (asset_id) REFERENCES public.asset(asset_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: asset f_key_asset_table; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT f_key_asset_table FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;


--
-- Name: asset_change_log fk_asset_change_log_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log
    ADD CONSTRAINT fk_asset_change_log_1 FOREIGN KEY (asset_id) REFERENCES public.asset(asset_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: asset_change_log fk_asset_change_log_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log
    ADD CONSTRAINT fk_asset_change_log_2 FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: asset_return_table fk_asset_return_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_return_table
    ADD CONSTRAINT fk_asset_return_1 FOREIGN KEY (return_id) REFERENCES public.return_table(return_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: asset_return_table fk_asset_return_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_return_table
    ADD CONSTRAINT fk_asset_return_2 FOREIGN KEY (asset_id) REFERENCES public.asset(asset_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: form_response_values_table fk_form_response_values_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_response_values_table
    ADD CONSTRAINT fk_form_response_values_1 FOREIGN KEY (response_id) REFERENCES public.form_responses_table(response_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: form_response_values_table fk_form_response_values_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_response_values_table
    ADD CONSTRAINT fk_form_response_values_2 FOREIGN KEY (field_id) REFERENCES public.form_fields_table(field_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: form_responses_table fk_form_responses; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_responses_table
    ADD CONSTRAINT fk_form_responses FOREIGN KEY (form_id) REFERENCES public.form_table(form_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: form_responses_table fk_form_responses2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_responses_table
    ADD CONSTRAINT fk_form_responses2 FOREIGN KEY (staff_id) REFERENCES public.employee(employee_id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;


--
-- Name: loan_table fk_loan_table; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_table
    ADD CONSTRAINT fk_loan_table FOREIGN KEY (staff_id) REFERENCES public.employee(employee_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: return_table fk_return_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_table
    ADD CONSTRAINT fk_return_1 FOREIGN KEY (loan_id) REFERENCES public.loan_table(loan_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: task_table fk_task_table_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_table
    ADD CONSTRAINT fk_task_table_1 FOREIGN KEY (loan_id) REFERENCES public.loan_table(loan_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: task_table fk_task_table_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_table
    ADD CONSTRAINT fk_task_table_2 FOREIGN KEY (staff_id) REFERENCES public.employee(employee_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: task_table fk_task_table_3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_table
    ADD CONSTRAINT fk_task_table_3 FOREIGN KEY (form_id) REFERENCES public.form_table(form_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: task_table fk_task_table_4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_table
    ADD CONSTRAINT fk_task_table_4 FOREIGN KEY (customer_id) REFERENCES public.customer_table(customer_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: tracking_table fk_tracking; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_table
    ADD CONSTRAINT fk_tracking FOREIGN KEY (task_id) REFERENCES public.task_table(task_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: form_fields_table form_fields_table_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_fields_table
    ADD CONSTRAINT form_fields_table_fkey1 FOREIGN KEY (form_id) REFERENCES public.form_table(form_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: employee staff_table_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT staff_table_fkey1 FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- PostgreSQL database dump complete
--

